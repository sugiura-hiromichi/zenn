//! [original](https://doc.rust-jp.rs/book-ja/ch20-01-single-threaded.html)

//use anyhow::anyhow;
use anyhow::Result as Rslt;
use std::net::TcpListener;
use std::net::TcpStream;

fn handle_connection(mut stream: TcpStream,) {}

fn main() -> Rslt<(),> {
	let listener = TcpListener::bind("127.0.0.1:7878",)?;
	for stream in listener.incoming() {
		let stream = stream?;

		handle_connection(stream,);
	}

	todo!()
}
