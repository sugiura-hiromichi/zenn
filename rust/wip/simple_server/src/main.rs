//! [original](https://doc.rust-jp.rs/book-ja/ch20-01-single-threaded.html)

//use anyhow::anyhow;
use anyhow::Result as Rslt;
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::net::TcpListener;
use std::net::TcpStream;

struct HTTPResponce {
	version: String,
	status:  u16,
	reason:  String,
	headers: Option<String,>,
	body:    Option<String,>,
}

impl HTTPResponce {
	fn new(v: &str, status: u16, r: &str, h: Option<&str,>, b: Option<&str,>,) -> Self {
		let h = if let Some(s,) = h { Some(s.to_string(),) } else { None };
		let b = if let Some(s,) = b { Some(s.to_string(),) } else { None };
		Self { version: v.to_string(), status, reason: r.to_string(), headers: h, body: b, }
	}

	fn format(&self,) -> String {
		let h = if let Some(s,) = &self.headers { s } else { &"".to_string() };
		let b = if let Some(s,) = &self.body { s } else { &"".to_string() };
		format!("{} {} {}\r\n{}\r\n{}", self.version, self.status, self.reason, h, b)
	}
}

fn handle_connection(mut stream: TcpStream,) -> Rslt<(),> {
	let mut buf = [10; 1024];
	stream.read(&mut buf,)?;
	let req = String::from_utf8_lossy(&buf,);
	let req = req.trim();
	println!("{req}");

	let req_line = req.lines().next().unwrap();

	println!("🫠--------------");
	let mut file = File::open("index.html",)?;
	let mut contents = String::new();
	file.read_to_string(&mut contents,)?;

	let rsp = HTTPResponce::new(
		"HTTP/1.1",
		200,
		"OK",
		Some("content-type: text/html\n",),
		Some(&contents,),
	);
	let rsp = rsp.format();

	stream.write(rsp.as_bytes(),)?;
	stream.flush()?;
	Ok((),)
}

fn main() -> Rslt<(),> {
	let listener = TcpListener::bind("127.0.0.1:7878",)?;

	for stream in listener.incoming() {
		let stream = stream?;

		handle_connection(stream,)?;
	}

	todo!()
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn return_keycode() {
		let rtrn_key = b'\n';
		assert_eq!(rtrn_key, 10);
	}
}
