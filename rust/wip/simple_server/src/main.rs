//! [original](https://doc.rust-jp.rs/book-ja/ch20-01-single-threaded.html)

//use anyhow::anyhow;
use anyhow::Result as Rslt;
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::net::TcpListener;
use std::net::TcpStream;

struct HTTPResponce {
	version: Vec<u8,>,
	status:  Vec<u8,>,
	reason:  Vec<u8,>,
	headers: Vec<u8,>,
	body:    Vec<u8,>,
}

impl HTTPResponce {
	fn new(v: &str, status: u16, r: &str, headers: Option<String,>, body: Vec<u8,>,) -> Self {
		Self {
			version: v.as_bytes().to_vec(),
			status: status.to_string().as_bytes().to_vec(),
			reason: r.as_bytes().to_vec(),
			headers: headers.map_or(vec![], |s| s.as_bytes().to_vec(),),
			body,
		}
	}

	fn format(&self,) -> Vec<u8,> {
		let statusline =
			[self.version.clone(), self.status.clone(), self.reason.clone(),].join(&[b' ',][..],);
		let rslt =
			[statusline, self.headers.clone(), self.body.clone(),].join(&[b'\r', b'\n',][..],);

		rslt
	}
}

fn handle_connection(mut stream: TcpStream,) -> Rslt<(),> {
	let mut buf = [10; 1024];
	stream.read(&mut buf,)?;
	let req = String::from_utf8_lossy(&buf,);
	let req = req.trim();
	println!("\n\n# Request\n\n{req}");

	let req_line = req.lines().next().unwrap();

	let uri = req_line
		.split_whitespace()
		.find(|s| !s.contains("GET",) && !s.contains("HTTP,",),)
		.unwrap();
	println!("\n\n# URI\n\n{uri}");

	let (path, cntnt_type,) = if uri == "/" {
		("index.html".to_string(), "text/html",)
	} else {
		let extension = uri.split('.',).last().unwrap();

		(
			".".to_owned() + uri,
			match extension {
				"js" => "text/javascript",
				"wasm" => "application/wasm",
				_ => "text/plain",
			},
		)
	};
	let mut file = File::open(path,)?;
	let mut contents = Vec::new();
	file.read_to_end(&mut contents,).expect("🫠 failed to load file",);

	let rsp = HTTPResponce::new(
		"HTTP/1.1",
		200,
		"OK",
		Some(format!("content-type: {cntnt_type}\n"),),
		contents,
	);
	let rsp = rsp.format();
	println!("\n\n# Responce\n\n{}", String::from_utf8_lossy(&rsp));
	let rsp = rsp.as_slice();

	stream.write(rsp,).expect("🫠 failed to write to stream",);
	stream.flush().expect("🫠 failed to flush stream",);
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
