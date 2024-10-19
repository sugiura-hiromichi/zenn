-- INFO: This file is `test.lua`
assert(true)
local table = { 6, 7, 8 }
assert(table[1] == 6)
-- local table_with_key = {
-- 	fn = {
-- 		expand = function()
-- 			print 'from table_with_key.fn.expand'
-- 		end,
-- 	},
-- }
--
-- assert(table_with_key['fn'] ~= nil)
-- table_with_key['fn']['expand']()

local with_new_line = '\nabc\n'
assert(with_new_line:sub(#with_new_line) == '\n', '🫠:' .. with_new_line:sub(1, 3))

local pbpaste = 'aaaa\nbbbbb\ncccccc\n\ta\nddd\n\n\neeee'
local lines = {}
local lines_with_nl = { '' }
local rslt = ''
for line in pbpaste:gmatch '([^\n\r]*)' do
	print(line)
	lines[#lines + 1] = line
	lines_with_nl[#lines_with_nl + 1] = line
	rslt = rslt .. line
end
lines_with_nl[#lines_with_nl] = ''

print('rslt is:\n' .. rslt)

print '🫠'
