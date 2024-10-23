//! When requesting that an argument be formatted with a particular
//! type, you are actually requesting that an argument ascribes to a
//! particular trait. This allows multiple actual types to be formatted
//! via {:x} (like i8 as well as isize). The current mapping of types to
//! traits is

#[cfg(test)]
mod tests {
	#[test]
	fn width() {
		let x = "x";
		let output = x.to_string() + "    !";
		assert_eq!(output, format!("{x:5}!"));
		assert_eq!(output, format!("{x:0$}!", 5));
		assert_eq!(output, format!("{x:width$}!", width = 5));
		assert_eq!(output, format!("{1:0$}!", 5, x));
		assert_eq!(output, format!("{0:1$}!", x, 5));
		assert_eq!(output, format!("{x:0$}!", 5));
	}

	#[test]
	fn fill_alignment() {
		assert_eq!(format!("{:<5}!", "x"), "x    !"); //left align
		assert_eq!(format!("{:-<5}!", "x"), "x----!"); //left align filled
		assert_eq!(format!("{:^5}!", "x"), "  x  !"); //center align
		assert_eq!(format!("{:>5}!", "x"), "    x!"); //right align
		assert_eq!(format!("{:->5}!", "x"), "----x!"); //right align filled
	}

	#[test]
	fn sign() {
		let s = "goodbye void";

		let s_display = "goodbye void";
		assert_eq!(format!("{}", s), s_display);
		assert_eq!(format!("{:}", s), s_display);
		assert_eq!(format!("{:#}", s), s_display);

		let s_debug = "\"goodbye void\"";
		assert_eq!(format!("{:?}", s), s_debug);

		let _s_pointer = format!("{s:p}");

		let v = vec![10, 11];
		let v_debug_lower_hex = "[a, b]";
		assert_eq!(format!("{v:x?}"), v_debug_lower_hex);

		let v_debug_upper_hex = "[A, B]";
		assert_eq!(format!("{v:X?}"), v_debug_upper_hex);

		let v_debug_pretty_print = "[\n    10,\n    11,\n]";
		assert_eq!(format!("{v:#?}"), v_debug_pretty_print);

		let i = 27;
		let i_octal = "33";
		assert_eq!(format!("{i:o}"), i_octal);

		let i_lower_hex = "1b";
		assert_eq!(format!("{i:x}"), i_lower_hex);

		let i_upper_hex = "1B";
		assert_eq!(format!("{i:X}"), i_upper_hex);

		let i_binary = "11011";
		assert_eq!(format!("{i:b}"), i_binary);

		let i_lower_exp = "2.7e1";
		assert_eq!(format!("{i:e}"), i_lower_exp);

		let i_upper_exp = "2.7E1";
		assert_eq!(format!("{i:E}"), i_upper_exp);
	}
}
