//! [original](https://pwy.io/posts/memory-for-nothing/)

#![allow(unused)]

use std::collections::HashMap;
use std::ops::RangeInclusive;

type City = String;
type CityRef<'a,> = &'a str;
type RoomRef<'a,> = &'a str;

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash,)]
struct Date {
	day: u32,
}

/// >[!tip] `Occupancy`とは、人数のこと
#[derive(Clone, Debug, PartialEq, Eq, Hash,)]
struct Occupancy {
	adults: u8,
}

#[derive(Clone, Debug, PartialEq,)]
struct Price<'a,> {
	city:  CityRef<'a,>,
	dates: RangeInclusive<Date,>,
	room:  RoomRef<'a,>,
	occ:   Occupancy,
	price: f32,
}

#[derive(Clone, Debug, PartialEq,)]
struct Query<'a,> {
	city:  CityRef<'a,>,
	dates: RangeInclusive<Date,>,
	occ:   Occupancy,
}

struct Index {
	indexed_prices: HashMap<City, HashMap<Occupancy, Vec<usize,>,>,>,
}

impl Index {
	fn new(prices: &[Price],) -> Self {
		let mut indexed_prices = HashMap::<City, HashMap<Occupancy, Vec<usize,>,>,>::new();
		prices.iter().enumerate().for_each(|(idx, price,)| {
			indexed_prices
				.entry(price.city.to_string(),)
				.or_default()
				.entry(price.occ.clone(),)
				.or_default()
				.push(idx,);
		},);
		Self { indexed_prices, }
	}

	fn find(&self, city: &str, occ: Occupancy,) -> impl Iterator<Item = usize,> + '_ {
		self.indexed_prices
			.get(city,)
			.into_iter()
			.filter_map(move |occs| occs.get(&occ,),)
			.flatten()
			.copied()
	}
}

fn query(prices: &[Price], index: &Index, query: &Query,) -> Option<f32,> {
	index
		.find(query.city, query.occ.clone(),)
		.map(|idx| &prices[idx],)
		.filter(|price| {
			price.dates.start() <= query.dates.start() && query.dates.end() <= price.dates.end()
		},)
		.map(|price| price.price,)
		.next()
}
