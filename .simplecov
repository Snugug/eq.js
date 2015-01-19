require 'simplecov'
require 'coveralls'

SimpleCov.formatter = Coveralls::SimpleCov::Formatter
SimpleCov.start do
   add_filter 'Gulpfile.js'
   add_filter 'karma.conf.js'
   add_filter 'tasks/'
   add_filter 'tests/'
end
