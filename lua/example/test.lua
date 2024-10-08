-- INFO: This file is `test.lua`
assert(true)
local table = { 6, 7, 8 }
assert(table[1] == 6)
local table_with_key = {
	fn = {
		expand = function()
			print 'from table_with_key.fn.expand'
		end,
	},
}

assert(table_with_key['fn'] ~= nil)
table_with_key['fn']['expand']()
print '🫠'
