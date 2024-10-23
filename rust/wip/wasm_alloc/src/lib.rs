use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
	pub fn alert(s: &str,);
}

pub fn greet(name: &str,) { alert(&format!("Hello. {name}!"),); }
