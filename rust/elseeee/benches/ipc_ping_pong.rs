//! TODO:
//! [source](https://pranitha.rs/posts/rust-ipc-ping-pong/)

fn main() { divan::main(); }

#[divan::bench]
fn stdio(b: divan::Bencher,) { let n = 1000; }
