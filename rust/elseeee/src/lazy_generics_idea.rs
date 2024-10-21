//! [original](https://geo-ant.github.io/blog/2024/rust-rethinking-builders-lazy-generics/#fn:bon-core)

pub struct Pod<'a, S, T,>
where
	S: std::fmt::Display,
	T: std::fmt::Debug + MyTrait,
{
	f1: f32,
	f2: S,
	f3: &'a T,
	f4: T::AssocType,
	f5: Option<T,>,
}

pub trait MyTrait {
	type AssocType;
}

impl MyTrait for i32 {
	type AssocType = Empty;
}

pub struct PodBuilder<F1, F2, F3, F4, F5,> {
	f1: F1,
	f2: F2,
	f3: F3,
	f4: F4,
	f5: F5,
}

impl PodBuilder<Empty, Empty, Empty, Empty, Empty,> {
	pub fn new() -> Self {
		Self {
			f1: Default::default(),
			f2: Default::default(),
			f3: Default::default(),
			f4: Default::default(),
			f5: Default::default(),
		}
	}
}

impl<F1, F2, F3, F4, F5,> PodBuilder<F1, F2, F3, F4, F5,> {
	pub fn build<'a, S, T,>(self,) -> Pod<'a, S, T,>
	where
		T: std::fmt::Debug + MyTrait,
		S: std::fmt::Display,
		F1: HasValue<ValueType = f32,>,
		F2: HasValue<ValueType = S,>,
		F3: HasValue<ValueType = &'a T,>,
		F4: HasValue<ValueType = T::AssocType,>,
		F5: HasValue<ValueType = Option<T,>,>,
	{
		Pod {
			f1: self.f1.value(),
			f2: self.f2.value(),
			f3: self.f3.value(),
			f4: self.f4.value(),
			f5: self.f5.value(),
		}
	}

	pub fn f1(self, f1: f32,) -> PodBuilder<Assigned<f32,>, F2, F3, F4, F5,>
	where F1: Assignable<f32,> {
		PodBuilder { f1: Assigned(f1,), f2: self.f2, f3: self.f3, f4: self.f4, f5: self.f5, }
	}

	pub fn f2<S,>(self, f2: S,) -> PodBuilder<F1, Assigned<S,>, F3, F4, F5,>
	where
		S: std::fmt::Display,
		F2: Assignable<S,>,
	{
		PodBuilder { f1: self.f1, f2: Assigned(f2,), f3: self.f3, f4: self.f4, f5: self.f5, }
	}

	pub fn f3<'a, T,>(self, f3: &'a T,) -> PodBuilder<F1, F2, Assigned<&'a T,>, F4, F5,>
	where
		T: std::fmt::Debug + MyTrait,
		F3: Assignable<T,>,
	{
		PodBuilder { f1: self.f1, f2: self.f2, f3: Assigned(f3,), f4: self.f4, f5: self.f5, }
	}

	pub fn f5<'a, T,>(self, f5: Option<T,>,) -> PodBuilder<F1, F2, F3, F4, Assigned<Option<T,>,>,>
	where
		T: std::fmt::Debug + MyTrait,
		F5: Assignable<Option<T,>,>,
	{
		PodBuilder { f1: self.f1, f2: self.f2, f3: self.f3, f4: self.f4, f5: Assigned(f5,), }
	}
}

#[derive(Default,)]
/// this type indicates field has not been set
pub struct Empty;
pub struct Assigned<T,>(T,);

pub trait Assignable<T,> {}
impl<T,> Assignable<T,> for Empty {}

pub trait HasValue {
	type ValueType;
	fn value(self,) -> Self::ValueType;
}

impl<T,> HasValue for Assigned<T,> {
	type ValueType = T;

	fn value(self,) -> Self::ValueType { self.0 }
}

impl HasValue for Empty {
	type ValueType = Empty;

	fn value(self,) -> Self::ValueType { Empty }
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn build_success_without_f4() {
		let f3 = &0;
		let builder = PodBuilder::new().f1(0.0,).f2("a",).f3(f3,).f5(Some(6,),);
		let pod = builder.build();
	}
}
