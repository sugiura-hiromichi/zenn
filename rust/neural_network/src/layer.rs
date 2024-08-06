use crate::BATCH;
use crate::LEARNING_RATE;
use rand::thread_rng;
use rand::Rng;

pub type Image = Vec<f32,>;

pub enum NeuralNetworkLayer {
	FC(FC,),
	ReLU(Vec<f32,>,),
	SoftMax,
}

impl NeuralNetworkLayer {
	pub fn forward(&mut self, x: &mut Image,) {
		match self {
			NeuralNetworkLayer::FC(fc,) => fc.forward(x,),
			NeuralNetworkLayer::ReLU(x_relu,) => {
				*x_relu = x.clone();
				x.iter_mut().for_each(|f| {
					if *f < 0.0 {
						*f = 0.0;
					};
				},);
			},
			NeuralNetworkLayer::SoftMax => {
				let mut x_max = 0.0;
				x.iter().for_each(|e| {
					if *e > x_max {
						x_max = *e;
					}
				},);
				let sum: f32 = x
					.iter_mut()
					.map(|f| {
						*f = (*f - x_max).exp();
						*f
					},)
					.sum();
				x.iter_mut().for_each(|f| {
					*f /= sum;
				},);
			},
		}
	}

	pub fn backward(&mut self, y: &mut Vec<f32,>, l: u8,) {
		match self {
			NeuralNetworkLayer::FC(fc,) => fc.backward(y,),
			NeuralNetworkLayer::ReLU(x,) => {
				x.iter().zip(y,).for_each(|(x, y,)| {
					if *x < 0.0 {
						*y = 0.0;
					}
				},)
			},
			NeuralNetworkLayer::SoftMax => {
				y[l as usize] -= 1.0;
			},
		}
	}

	pub fn update(&mut self,) {
		if let NeuralNetworkLayer::FC(fc,) = self {
			let f = |x: &mut ElemAndDiff| {
				x.elem -= x.diff * LEARNING_RATE / BATCH as f32;
				x.diff = 0.0;
			};

			fc.a.iter_mut().for_each(|v| v.iter_mut().for_each(f,),);
			fc.b.iter_mut().for_each(f,);
		}
	}

	pub fn infer(&self, x: &mut Image,) {
		match self {
			NeuralNetworkLayer::FC(fc,) => fc.infer(x,),
			NeuralNetworkLayer::ReLU(_,) => x.iter_mut().for_each(|f| {
				if *f < 0.0 {
					*f = 0.0;
				}
			},),
			NeuralNetworkLayer::SoftMax => {
				let mut x_max = 0.0;
				x.iter_mut().for_each(|&mut f| {
					if f > x_max {
						x_max = f;
					}
				},);
				let sum: f32 = x
					.iter_mut()
					.map(|f| {
						*f -= x_max;
						f32::exp(*f,)
					},)
					.sum();
				x.iter_mut().for_each(|f| {
					*f /= sum;
				},);
			},
		}
	}
}

/// a\[out_idx\]\[in_idx\]
/// b\[out_idx\]
/// x\[in_idx\]
pub struct FC {
	pub p: FCParamSize,
	/// \[output\]\[input\]
	pub a: Vec<Vec<ElemAndDiff,>,>,
	/// output
	pub b: Vec<ElemAndDiff,>,
	/// input of forward
	pub x: Vec<f32,>,
}

/// x: n, A: n\*m, b: m, y:m
/// n: dimention of output
/// m: dimention of input
pub struct FCParamSize {
	pub input:  usize,
	pub output: usize,
}

#[derive(Clone,)]
pub struct ElemAndDiff {
	pub elem: f32,
	diff:     f32,
}

impl FC {
	pub fn init(p: FCParamSize,) -> Self {
		let mut rng = thread_rng();

		let mut a = vec![
			vec![ElemAndDiff { elem: 0.0, diff: 0.0, }; p.input];
			p.output
		];
		a.iter_mut().for_each(|row| {
			row.iter_mut().for_each(|e| {
				e.elem = rng.gen_range(-1.0..1.0,);
			},)
		},);

		let mut b = Vec::with_capacity(p.output,);
		(0..b.capacity()).for_each(|_| {
			b.push(ElemAndDiff { elem: rng.gen_range(-1.0..1.0,), diff: 0.0, },)
		},);

		Self {
			p: FCParamSize { input: p.input, output: p.output, },
			a,
			b,
			x: Vec::with_capacity(p.input,),
		}
	}

	fn forward(&mut self, x: &mut Vec<f32,>,) {
		self.x = x.clone();
		self.infer(x,);
	}

	fn backward(&mut self, y: &mut Vec<f32,>,) {
		let mut buf = vec![0.0; self.p.input];
		for m in 0..self.p.output {
			self.b[m].diff = y[m];
			for n in 0..self.p.input {
				//				assert!(
				//					!self.a[m][n].diff.is_nan(),
				//					"assertion failed in layer::FC::backward\n\ty[m]: \
				//					 {}\n\tself.x[n]: {}",
				//					y[m],
				//					self.x[n]
				//				);
				self.a[m][n].diff += y[m] * self.x[n];
				buf[n] += y[m] * self.a[m][n].elem;
			}
		}
		*y = buf;
	}

	/// # param
	///
	/// make sure that below do not panic
	/// ```
	/// assert_eq!(x.len(), self.p.input)
	/// ```
	fn infer(&self, x: &mut Image,) {
		let mut y = Vec::with_capacity(self.p.output,);
		for o in 0..self.p.output {
			let mut sum = self.b[o].elem;
			for i in 0..self.p.input {
				sum += self.a[o][i].elem * x[i];
			}
			y.push(sum,);
		}
		*x = y;
	}
}

#[cfg(test)]
mod tests {

	use super::*;

	#[test]
	fn fc_init() {
		let fc = FC::init(FCParamSize { output: 5, input: 10, },);
		assert_eq!(fc.a.len(), fc.p.output, "index of `fc.a` is incorrect");
		assert_eq!(
			fc.a.len(),
			fc.a.capacity(),
			"fc.a has unused allocated space"
		);

		assert_eq!(
			fc.a[0].capacity(),
			fc.a[0].len(),
			"fc.a[0] has unused allocated space"
		);
		assert_eq!(
			fc.a[0].len(),
			fc.p.input,
			"index of `fc.a[0]` is incorrect"
		);
		assert_eq!(fc.x.capacity(), fc.p.input);

		(1..fc.a.len()).for_each(|i| {
			fc.a[i].iter().zip(fc.a[i - 1].iter(),).for_each(|(e1, e2,)| {
				assert!((e1.elem - e2.elem).abs() > f32::EPSILON);
			},);
		},);

		let fc1 = FC::init(FCParamSize { input: 5, output: 10, },);
		let mut coincidence = 0;
		fc.a.iter().zip(fc1.a,).for_each(|(v, v1,)| {
			v.iter().zip(v1,).for_each(|(e, e1,)| {
				if (e.elem - e1.elem).abs() == f32::EPSILON {
					coincidence += 1;
				}
			},)
		},);

		assert_eq!(coincidence, 0);
	}

	#[test]
	fn random_test() {
		let mut random = thread_rng();
		let try_amount = 1000;
		let mut equal = 0;
		(0..try_amount).for_each(|_| {
			equal += i32::from(
				random.gen_range(-1.0..1.0,) == random.gen_range(-1.0..1.0,),
			);
		},);
		assert!(equal < 2);
	}

	#[test]
	fn alloc_by_push() {
		let mut v = Vec::with_capacity(16,);
		let vcl = v.clone();
		assert_eq!(v.capacity(), 16);
		v.push(0,);
		assert_eq!(v.len(), 1);
		assert_eq!(v.capacity(), 16);
		assert_eq!(vcl.capacity(), 0);
	}

	#[test]
	fn softmax_test() {
		let mut sfm = NeuralNetworkLayer::SoftMax;
		let x = &mut vec![1.0, 2.0, 3.0, 4.0];
		sfm.forward(x,);
		assert!((x.iter().sum::<f32>() - 1.0).abs() < f32::EPSILON);
	}
}
