#![allow(unused)]
use anyhow::{self};
use log::debug;
use log::error;
use log::info;
use nix::mount::*;
use nix::sched::clone;
use nix::sched::unshare;
use nix::sched::CloneFlags;
use nix::sys::signal::Signal;
use nix::sys::signal::Signal::SIGCHLD;
use nix::sys::wait::waitpid;
use nix::unistd::chroot;
use nix::unistd::execvp;
use simplelog::*;
use std::env::args;
use std::env::set_current_dir;
use std::ffi::CString;
use std::process::Command;

fn main() {
	println!("Hello, world!");
}
