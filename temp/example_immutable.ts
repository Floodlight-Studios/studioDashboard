var im = require('immutable')
var data1 = im.fromJS({
    x: 1,
    z: 'z',
    a: {
        b: {
            c: ['1','2',{Foo: 'Bar'} ]
        }
    }
});

data1

// option 1: replace just value
var data2 = data1.updateIn(['a','b','c',2,'Foo'],val=> 'FooBar')

// option 2: create a whole new map
//data1.updateIn(['a','b','c',2],val=> im.Map({Fee: 'Moo'}))

