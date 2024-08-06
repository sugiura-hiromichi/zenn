use crate::file_io::load_params;
use crate::file_io::save;
use crate::file_io::MnistData;
use crate::layer::FCParamSize;
use crate::layer::Image;
use crate::layer::NeuralNetworkLayer;
use crate::layer::FC;
use anyhow::anyhow;
use anyhow::Ok;
use anyhow::Result;
use rand::thread_rng;
use rand::Rng;

mod file_io;
mod layer;

const BATCH: usize = 1000;
const LEARNING_RATE: f32 = 0.1;
const FC1: FCParamSize = FCParamSize { input: 768, output: 50, };
const FC2: FCParamSize = FCParamSize { input: 50, output: 100, };
const FC3: FCParamSize = FCParamSize { input: 100, output: 10, };
/// (train, test, h, w,dim);
const ASSERT_CHECK: (usize, usize, usize, usize, usize,) =
	(60000, 10000, 28, 28, 10,);
const PATH: &str = "/Users/a/Desktop/QwQ/c/szht_prg/nn/data-samplecode-v14";

type NeuralNetwork = Vec<NeuralNetworkLayer,>;

fn loss(t: u8, y: &Vec<f32,>,) -> f32 { -y[t as usize].ln() }

fn sgd(layers: &mut NeuralNetwork, x: &Vec<Image,>, l: &Vec<u8,>,) {
	let batch_repeat = ASSERT_CHECK.0 / BATCH;

	for i in 0..batch_repeat {
		for j in 0..BATCH {
			let idx = i * BATCH + j;
			let sub_x = &mut x[idx].clone();
			let sub_l = l[idx];

			layers.iter_mut().for_each(|l| l.forward(sub_x,),);
			println!("loss: {}", loss(sub_l, sub_x,),);
			layers.iter_mut().rev().for_each(|l| l.backward(sub_x, sub_l,),);
		}

		layers.iter_mut().for_each(|l| l.update(),);
	}
}

/// # return value
/// this `fn` returns correctness of inference
fn infer(nn: &NeuralNetwork, images: &Vec<Image,>, labels: &Vec<u8,>,) -> f64 {
	let img_amount = images.len();
	let mut correct = 0;
	(0..img_amount).for_each(|i| {
		if infer_once(nn, &images[i], labels[i],) {
			correct += 1;
		}
	},);

	correct as f64 / img_amount as f64
}

/// # return
///
/// this `fn` returns `true` if inference succeeded, `false` if failed
///
/// # param
///
/// `nn`: neural network itself
/// `img`: data of an image
/// `lab`: label to an image
///
/// # assumption
///
/// `infer_once()` is assumed to be used in `infer()`
fn infer_once(nn: &NeuralNetwork, img: &Image, lab: u8,) -> bool {
	let mut inference = img.to_owned();
	nn.iter().for_each(|layer| layer.infer(&mut inference,),);

	let mut max = (0, 0.0,);
	inference.iter().enumerate().for_each(|(i, &f,)| {
		if max.1 < f {
			max.0 = i;
			max.1 = f;
		}
	},);

	lab as usize == max.0
}

fn shuffle(images: &mut Vec<Image,>, labels: &mut Vec<u8,>,) {
	let times = 30000;
	let len = images.len();
	let mut rng = thread_rng();
	for _ in 0..times {
		let (i, j,) = (rng.gen_range(0..len,), rng.gen_range(0..len,),);
		images.swap(i, j,);
		labels.swap(i, j,);
	}
}

fn learn(nn: &mut NeuralNetwork, datas: &mut MnistData,) -> Result<(),> {
	let mut tr = infer(nn, &datas.train_image, &datas.train_label,);
	while tr < 0.9 {
		println!("tr: {tr}");
		shuffle(&mut datas.train_image, &mut datas.train_label,);
		sgd(nn, &datas.train_image, &datas.train_label,);
		tr = infer(nn, &datas.train_image, &datas.train_label,);
	}

	let ts = infer(nn, &datas.test_image, &datas.test_label,);
	if tr - ts > 0.3 {
		return Err(anyhow!("overlearned: tr-ts == {}", tr - ts),);
	}
	Ok((),)
}

fn main() -> Result<(),> {
	let mut datas = MnistData::load_data();

	let mut nn = vec![
		NeuralNetworkLayer::FC(FC::init(FC1,),),
		NeuralNetworkLayer::ReLU(Vec::with_capacity(FC1.output,),),
		NeuralNetworkLayer::FC(FC::init(FC2,),),
		NeuralNetworkLayer::ReLU(Vec::with_capacity(FC2.output,),),
		NeuralNetworkLayer::FC(FC::init(FC3,),),
		NeuralNetworkLayer::SoftMax,
	];

	learn(&mut nn, &mut datas,)?;

	save(&nn,)?;
	load_params(&mut nn,);
	Ok((),)
}

#[allow(dead_code, unused_imports)]
#[cfg(test)]
mod tests {

	use super::*;
	use std::ops::Add;

	pub mod sample {
		use super::super::*;

		pub fn fc_param() -> FCParamSize {
			FCParamSize { input: 128, output: 2, }
		}
		pub fn fc() -> NeuralNetworkLayer {
			NeuralNetworkLayer::FC(FC::init(fc_param(),),)
		}
		pub fn relu() -> NeuralNetworkLayer {
			NeuralNetworkLayer::ReLU(vec![],)
		}
		pub fn softmax() -> NeuralNetworkLayer { NeuralNetworkLayer::SoftMax }
		pub fn nn() -> NeuralNetwork { vec![fc(), relu(), softmax()] }
	}

	#[test]
	fn nan_comparison() {
		assert_ne!(0.0, f32::NAN,);
		assert_ne!(f32::NAN, f32::NAN);
		let mut a = f32::INFINITY;
		assert_eq!(f32::MAX.add(f32::MAX), a);
		a -= f32::INFINITY;
		assert!(a.is_nan());
	}

	#[test]
	fn ln_behavior() {
		let this_is_inf = -0.0_f32.ln();
		assert!(this_is_inf.is_infinite());
		let this_is_nan = f32::NAN.ln();
		assert!(this_is_nan.is_nan());
	}

	#[test]
	fn mini_nn() {
		let mut nn = sample::nn();

		let mut images = vec![];
		let mut labels = vec![];
		for _ in 0..1000 {
			let mut array = [0.0; 128];
			thread_rng().fill(&mut array,);
			let mut idx_of_max = 0;
			for i in 0..array.len() {
				if array[idx_of_max] < array[i] {
					idx_of_max = i;
				}
			}
			idx_of_max = idx_of_max % 2;

			let array = &mut array.to_vec();
			images.push(array.clone(),);
			labels.push(idx_of_max as u8,);
		}

		let first_correctness = infer(&nn, &images, &labels,);

		let images = vec![vec![0.0, 0.1, 0.2, 0.3]; 1000];
		let labels = vec![1; 1000];

		for i in 0..1000 {
			let array = &mut images[i].clone();
			let idx_of_max = labels[i].clone();
			nn.iter_mut().for_each(|l| l.forward(array,),);
			nn.iter_mut().for_each(|l| l.backward(array, idx_of_max as u8,),);
			//			let NeuralNetworkLayer::FC(ref fc,) = nn[0] else { return };
			nn.iter_mut().for_each(|l| l.update(),);
		}

		let second_correctness = infer(&nn, &images, &labels,);
		assert_ne!(first_correctness, second_correctness);
		assert_eq!(first_correctness, second_correctness);
	}
}
