//! # doc
//!
//! hello
//!
//! ## indent
//!
//! 0w0
//! - [ ] todo
//! - [-] pending
//! - [x] done

#![allow(dead_code)]

#[derive(Debug,)]
struct SelfRef {
	x:   u8,
	/// ptrはxへのアドレスを指していて欲しいがSelfRefがムーブされると別のアドレスを指すようになる
	///
	/// 別のアドレスとはどこのこと？
	/// →多分ムーブされることでxのアドレスが（というかthisのアドレス）変わる
	ptr: *const u8,
}

impl SelfRef {
	pub fn new(x: u8,) -> Self {
		let mut this = Self { x, ptr: std::ptr::null(), };
		this.ptr = &this.x;

		// ptrはxを指しているので成功する
		assert_eq!(&this.x as *const _, this.ptr);

		// xのアドレスが変わる
		this
	}
}

struct PinnedSelfRef {
	/// ---
	/// # markdown
	///
	/// *beautiful*
	/// - [ ] todo
	/// - [-] pending
	/// - [x] done
	///
	/// >[!note]
	/// >quote
	x:       u8,
	ptr:     *const u8,
	/// PhantomPinned型はUnpin型を実装しない
	/// このメンバーを追加する事により、_pinnedを含むPinnedSelfRefもUnpinを実装しなくなる
	/// しかし...
	_pinned: std::marker::PhantomPinned,
}

impl PinnedSelfRef {
	pub fn new(x: u8,) -> Self {
		// TODO: このコードを見る限りPhantomPinnedは型としても値としても扱われているがなぜこれが可能なのだろうか
		// →フィールドを持たない構造体はインスタンス生成時の{}を省略できるから見た目上型を値として扱っているように見える
		let mut this = Self { x, ptr: std::ptr::null(), _pinned: std::marker::PhantomPinned, };
		this.ptr = &this.x;

		// ptrはxを指しているので成功する
		assert_eq!(&this.x as *const _, this.ptr);

		// xのアドレスが変わる
		this
	}
}

#[allow(unused_imports)] use pin_utils::pin_mut;

struct NotUnpin {
	_pinned: std::marker::PhantomPinned,
}

impl NotUnpin {
	pub fn new() -> Self { Self { _pinned: std::marker::PhantomPinned, } }

	pub fn method(self: std::pin::Pin<&mut Self,>,) { println!("🫠 Here is Pin") }
}

/// - [-] 値がPinで包まれているかをコンパイル時に確認するためのダミー関数
fn assert_pin<T,>(_: &std::pin::Pin<&mut T,>,) {}

#[pin_project::pin_project]
struct Hoge {
	field: u8,
}

impl Hoge {
	fn get(self: std::pin::Pin<&Self,>,) -> u8 { self.field }

	fn inc(mut self: std::pin::Pin<&mut Self,>,) {
		let this = self.as_mut().project();
		*this.field += 1;
		unsafe {
			let this: &mut Hoge = self.as_mut().get_unchecked_mut();
			this.field += 1;
		}
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn is_ptr_point_to_x() {
		let v = SelfRef::new(0,);
		assert_ne!(&v.x as *const _, v.ptr);
	}

	#[test]
	/// しかし、Unpinを実装していなくてもムーブ自体はできてしまう
	fn pinned_can_be_moved() {
		let v = PinnedSelfRef::new(0,);
		assert_ne!(&v.x as *const _, v.ptr);
	}

	#[test]
	/// オブジェクトがムーブしない時はどのような時だろうか
	fn no_more_move() {
		// vへの参照を **vと同じ名前で** 定義する
		// こうするとはじめに定義したvに文法上アクセスできなくなりムーブされなくなる
		let mut v = SelfRef::new(0,);
		let v: &mut SelfRef = &mut v;

		// またはヒープの変数もムーブされない
		let mut x = Box::new(SelfRef::new(0,),);

		// と思いきや..
		let _y = std::mem::replace(v, SelfRef::new(1,),);
		let _y = std::mem::replace(&mut *x, SelfRef::new(2,),);
		// これらの操作はv,xをムーブする
	}

	#[test]
	fn my_move_test() {
		let a = SelfRef::new(0,);
		// SelfRefはPointerトレイトを実装していないので次のコードはコンパイルできない
		//let first_address = format!("{a:p}");
		let a = &a;
		let _second_address = format!("{a:p}");

		println!("{a:?}");
	}

	#[test]
	fn pin_utils_crate() {
		let obj = NotUnpin::new();
		// objはUnpinを実装していないためstd::pin::Pin::newは使えない
		// let obj=Pin::new(obj);

		// これによって(この場合は)スタックにピン留めすることができる
		pin_mut!(obj);

		// objがPin<&mut NotUnpin>である事の確認
		assert_pin::<NotUnpin,>(&obj,);

		// `method`はselfをPin<&mut Self>として受け取るので`pin_mut!`するまで呼び出せない
		obj.as_mut().method();
		obj.as_mut().method();
	}

	#[test]
	fn hoge_check() {
		let hoge = Hoge { field: 0, };
		pin_mut!(hoge);
		hoge.as_mut().inc();
		assert_eq!(hoge.as_ref().get(), 2);
	}
}
