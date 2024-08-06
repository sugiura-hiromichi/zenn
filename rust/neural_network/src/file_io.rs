use crate::layer::ElemAndDiff;
use crate::layer::Image;
use crate::layer::NeuralNetworkLayer;
use crate::NeuralNetwork;
use crate::ASSERT_CHECK;
use crate::PATH;
use anyhow::Result;
use std::fs::File;
use std::io::BufReader;
use std::io::BufWriter;
use std::io::Bytes;
use std::io::Read;
use std::io::Write;

pub struct MnistData {
	pub train_image: Vec<Image,>,
	pub train_label: Vec<u8,>,
	pub test_image:  Vec<Image,>,
	pub test_label:  Vec<u8,>,
}

impl MnistData {
	pub fn load_data() -> Self {
		MnistData {
			train_image: MnistData::load_images(
				format!("{PATH}/train-images-idx3-ubyte"),
				ASSERT_CHECK.0,
			),
			train_label: MnistData::load_labels(
				format!("{PATH}/train-labels-idx1-ubyte"),
				ASSERT_CHECK.0,
			),
			test_image:  MnistData::load_images(
				format!("{PATH}/t10k-images-idx3-ubyte"),
				ASSERT_CHECK.1,
			),
			test_label:  MnistData::load_labels(
				format!("{PATH}/t10k-labels-idx1-ubyte"),
				ASSERT_CHECK.1,
			),
		}
	}

	fn load_images(path: String, count: usize,) -> Vec<Image,> {
		let f = File::open(&path,).expect(&format!("failed to open {path}"),);
		let reader = BufReader::new(f,);

		let b = &mut reader.bytes();
		let x = Self::to_usize;
		let (h, w,) = (ASSERT_CHECK.2, ASSERT_CHECK.3,);
		assert_eq!((x(b), x(b), x(b), x(b)), (2051, count, h, w),);

		let mut rslt = Vec::with_capacity(count,);
		for _ in 0..count {
			let mut img = Image::with_capacity(w * h,);
			for _ in 0..h * w {
				img.push(b.next().unwrap().unwrap() as f32 / 256.0,);
			}
			rslt.push(img,);
		}
		rslt
	}

	fn load_labels(path: String, count: usize,) -> Vec<u8,> {
		let b = &mut BufReader::new(
			File::open(&path,).expect(&format!("failed to open {path}",),),
		)
		.bytes();
		let x = Self::to_usize;
		assert_eq!((x(b), x(b)), (2049, count),);

		b.into_iter().map(|u| u.unwrap(),).collect()
	}

	fn to_usize(b: &mut Bytes<BufReader<File,>,>,) -> usize {
		(0..4)
			.rev()
			.map(|i| (b.next().unwrap().unwrap() as usize) << (i * 8),)
			.sum()
	}
}

pub fn save(nn: &NeuralNetwork,) -> Result<(),> {
	let mut fc_num = 0;
	nn.iter().for_each(|layer| {
		if let NeuralNetworkLayer::FC(fc,) = layer {
			fc_num += 1;
			std::fs::remove_file(format!("{PATH}/a{fc_num}.dat"),)
				.expect("remove file has failed (a)",);
			std::fs::remove_file(format!("{PATH}/b{fc_num}.dat"),)
				.expect("remove file has failed (b)",);

			let mut f_a = BufWriter::new(
				File::create(format!("{PATH}/a{fc_num}.dat"),).unwrap(),
			);
			let mut f_b = BufWriter::new(
				File::create(format!("{PATH}/b{fc_num}.dat"),).unwrap(),
			);

			fc.a.iter().for_each(|row| {
				row.iter().for_each(|x| {
					f_a.write(&x.elem.to_be_bytes(),)
						.expect("failed to save param a",);
				},)
			},);
			fc.b.iter().for_each(|x| {
				f_b.write(&x.elem.to_be_bytes(),)
					.expect("failed to save param b",);
			},);
		}
	},);
	Ok((),)
}

pub fn load_params(nn: &mut NeuralNetwork,) {
	let mut fc_num = 0;
	fn load_to_param(
		v: &mut Vec<ElemAndDiff,>,
		load_from: &mut Bytes<BufReader<File,>,>,
	) {
		v.iter_mut().for_each(|e| {
			e.elem = (0..4)
				.map(|_| load_from.next().unwrap().unwrap() as f32,)
				.sum();
		},)
	}

	nn.iter_mut().for_each(|layer| {
		if let NeuralNetworkLayer::FC(fc,) = layer {
			fc_num += 1;
			let mut f_a = BufReader::new(
				File::create(format!("{PATH}/a{fc_num}.dat"),).unwrap(),
			)
			.bytes();
			let mut f_b = BufReader::new(
				File::create(format!("{PATH}/b{fc_num}.dat"),).unwrap(),
			)
			.bytes();

			fc.a.iter_mut().for_each(|row| {
				load_to_param(row, &mut f_a,);
			},);
			load_to_param(&mut fc.b, &mut f_b,);
		}
	},)
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn label_load() {
		let a = MnistData::load_labels(
			format!("{PATH}/train-labels-idx1-ubyte"),
			ASSERT_CHECK.0,
		);
		assert_eq!(a.len(), ASSERT_CHECK.0);
	}

	#[test]
	fn image_load() {
		let a = MnistData::load_images(
			format!("{PATH}/train-images-idx3-ubyte"),
			ASSERT_CHECK.0,
		);
		assert_eq!(a.len(), ASSERT_CHECK.0);
		assert_eq!(a[0].len(), ASSERT_CHECK.2 * ASSERT_CHECK.3);
	}
}
