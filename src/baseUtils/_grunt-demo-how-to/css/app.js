var grunt = require('grunt')
console.log('begin...')
var child = grunt.util.spawn({ grunt: true, args: ['default'] }, function() {

  console.log('done....')
})
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

console.log('end..')
