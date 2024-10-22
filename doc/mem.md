- cargoを使って.wasmファイルを吐き出すにはCargo.tomlに

```toml
[lib]
crate-type = ["cdylib"]
```

が必要
