const $mvc = require('spore-kit-mvc');
// const $getUniqueKey = require('spore-kit-str/getUniqueKey');

console.log(
	Object.keys($mvc).map(
		name => ('spore-kit-mvc/' + name)
	).join('\n')
);

describe('mvc.base', () => {
	const $base = $mvc.Base;
	test('选项可以被设置在defaults属性对象中，初始化完成后通过conf属性获取设置的选项值', () => {
		const Child = $base.extend({
			defaults: {
				prop: null
			},
			setProp: function(val) {
				this.conf.prop = val;
			},
			getProp: function() {
				return this.conf.prop;
			}
		});
		const o1 = new Child({
			prop: 'value'
		});
		const o2 = new Child();
		o2.setProp('v1');
		const o3 = new Child();

		expect(o1.conf.prop).toBe('value');
		expect(o1.getProp()).toBe('value');
		expect(o2.conf.prop).toBe('v1');
		expect(o2.getProp()).toBe('v1');
		expect(o3.conf.prop).toBeNull();
		expect(o3.getProp()).toBeNull();
		expect($base.prototype.defaults.prop).toBeUndefined();
	});

	test('defaults属性对象是设置在原型上的，所以不要在函数中直接修改defaults对象，会影响到原型', () => {
		const Child = $base.extend({
			defaults: {
				a: 1
			},
			setDef: function(val) {
				this.defaults.a = val;
			}
		});
		const o1 = new Child();
		const o2 = new Child();
		o2.setDef(2);
		const o3 = new Child();

		expect(o1.conf.a).toBe(1);
		expect(o2.conf.a).toBe(1);
		expect(Child.prototype.defaults.a).toBe(2);
		expect(o3.conf.a).toBe(2);
	});

	test('class Base 提供了 setOptions 方法用于设置选项', () => {
		const Child = $base.extend({
			defaults: {
				a: 1,
				b: 2,
				c: 3
			}
		});

		const obj = new Child();
		obj.setOptions({
			a: 9,
			b: 8
		});

		expect(obj.conf.a).toBe(9);
		expect(obj.conf.b).toBe(8);
		expect(obj.conf.c).toBe(3);
	});

	test('setOptions 方法以深度混合方式来混合选项数据', () => {
		const Child = $base.extend({
			defaults: {
				a: 1,
				b: {
					c: 2,
					d: 3
				}
			}
		});

		const o1 = new Child({
			a: 2,
			b: 3
		});

		const o2 = new Child({
			a: 3,
			b: {
				c: 3
			}
		});

		expect(o1.conf.a).toBe(2);
		expect(o1.conf.b).toBe(3);
		expect(o2.conf.a).toBe(3);
		expect(o2.conf.b.c).toBe(3);
		expect(o2.conf.b.d).toBe(3);
	});

	test('可重复调用 setOptions 方法覆盖原有选项', () => {
		const Child = $base.extend({
			defaults: {
				a: 1,
				b: 2,
				c: 3
			}
		});

		const o1 = new Child({
			a: 10
		});
		o1.setOptions({
			b: 11
		});

		expect(o1.conf.a).toBe(10);
		expect(o1.conf.b).toBe(11);
		expect(o1.conf.c).toBe(3);
	});

	test('提供借口 build 函数以供覆盖，build 为初始化函数', () => {
		let builded = 0;
		const Child = $base.extend({
			build() {
				builded++;
			}
		});
		const o1 = new Child();
		expect(builded).toBe(1);
		o1.destroy();
	});

	test('需要自定义 setEvents 函数来进行事件函数的绑定，默认传递字符串 "on" 作为参数', () => {
		let eventSeted = 0;
		let act = '';
		const Child = $base.extend({
			setEvents(action) {
				eventSeted++;
				act = action;
			}
		});
		const o1 = new Child();

		expect(eventSeted).toBe(1);
		expect(act).toBe('on');
		o1.destroy();
	});

	test('提供 proxy 函数确保一个函数可以在实例的上下文中执行', () => {
		const Child = $base.extend({
			defaults: {
				count: 0
			},
			method() {
				const conf = this.conf;
				conf.count++;
			}
		});
		const o1 = new Child();
		const o2 = new Child({
			count: 10
		});
		const o3 = new Child({
			count: 10
		});
		const proxy = o1.proxy();
		o2.method = proxy('method');
		o2.method();
		o3.method();

		expect(o1.conf.count).toBe(1);
		expect(o2.conf.count).toBe(10);
		expect(o3.conf.count).toBe(11);
	});

	test('proxy 方法可为函数设置默认参数，追加到实际参数后面', () => {
		const Child = $base.extend({
			defaults: {
				str: 'obj'
			},
			plus(str, type) {
				const conf = this.conf;
				str = str || 0;
				if (type === 'reverse') {
					conf.str = str + conf.str;
				} else {
					conf.str += str;
				}
			}
		});

		const o1 = new Child();
		o1.plus('1');

		const o2 = new Child({
			str: 'obj2'
		});
		const o2proxy = o2.proxy();
		const plus = o2proxy('plus', 'reverse');
		o2.plus('2');

		const o3 = new Child({
			str: 'obj3'
		});
		o3.plus = plus;
		o3.plus('3');

		expect(o1.conf.str).toBe('obj1');
		expect(o2.conf.str).toBe('3obj22');
		expect(o3.conf.str).toBe('obj3');
	});

	test('基类的销毁函数 destroy 用于扩展和覆盖，会解绑所有事件函数', () => {
		let count = 0;
		const Child = $base.extend({
			setEvents() {
				this.on('action', this.proxy('method'));
			},
			method() {
				count++;
			}
		});
		const o1 = new Child();
		o1.trigger('action');
		const bound = o1.bound;
		o1.destroy();
		o1.trigger('action');

		expect(typeof bound.method).toBe('function');
		expect(count).toBe(1);
		expect(o1.bound).toBeNull();
	});
});

describe('mvc.model', () => {
	const $model = $mvc.Model;

	test('可以用 get 方法获取模型的数据', () => {
		const m1 = new $model({
			a: 1
		});
		expect(m1.get('a')).toBe(1);
	});

	test('传入选项数据，可直接建立模型数据。', () => {
		const m = new $model({
			a: 1,
			b: 2
		});
		expect(m.get('a')).toBe(1);
		expect(m.get('b')).toBe(2);
	});

	test('未设置默认属性的情况下，不给予数据，或者给予错误的数据，创建的模型数据为空对象', () => {
		const m1 = new $model();
		const m2 = new $model([1, 2, 3]);
		const m3 = new $model(null);

		expect(m1.keys().length).toBe(0);
		expect(m2.keys().length).toBe(0);
		expect(m3.keys().length).toBe(0);
	});

	test('派生的模型子类可设置默认数据，创建模型实例时，如果没有传入参数，视为使用默认数据', () => {
		const Model = $model.extend({
			defaults: {
				a: 1,
				b: 2
			}
		});

		const m1 = new Model();
		const m2 = new Model({
			a: 3,
			c: 4
		});
		const m3 = new Model(null);
		const m4 = new Model([1, 2, 3]);

		expect(m1.get('a')).toBe(1);
		expect(m1.get('b')).toBe(2);
		expect(m1.keys().length).toBe(2);

		expect(m2.get('a')).toBe(3);
		expect(m2.get('b')).toBe(2);
		expect(m2.get('c')).toBe(4);
		expect(m2.keys().length).toBe(3);

		expect(m3.get('a')).toBe(1);
		expect(m3.get('b')).toBe(2);
		expect(m3.keys().length).toBe(2);

		expect(m4.get('a')).toBe(1);
		expect(m4.get('b')).toBe(2);
		expect(m4.keys().length).toBe(2);
	});

	test('创建实例时传入的数据，不会影响到默认数据', () => {
		const Model = $model.extend({
			defaults: {
				a: 1,
				b: 2
			}
		});

		const m1 = new Model({
			a: 3,
			c: 4
		});

		expect(m1.defaults.a).toBe(1);
		expect(m1.defaults.b).toBe(2);
		expect(Object.keys(m1.defaults).length).toBe(2);
	});

	test('set 方法用于设置属性值，不给 value 值，相当于设置 value 为 undefined', () => {
		const m1 = new $model({
			a: 1,
			b: 1,
			c: 1,
			d: 1,
			e: 1
		});

		m1.set('a');
		m1.set('b', null);
		m1.set('c', '');
		m1.set('d', 2);
		m1.set('e', 0);

		expect(m1.get('a')).toBeUndefined();
		expect(m1.get('b')).toBeNull();
		expect(m1.get('c')).toBe('');
		expect(m1.get('d')).toBe(2);
		expect(m1.get('e')).toBe(0);
	});

	test('可以给 set 方法传入一个对象，批量设置模型属性', () => {
		const m1 = new $model({
			a: 1,
			b: 1,
			c: 1,
			d: 1,
			e: 1
		});

		m1.set({
			'a': undefined,
			'b': null,
			'c': '',
			'd': 2,
			'e': 0
		});

		expect(m1.get('a')).toBeUndefined();
		expect(m1.get('b')).toBeNull();
		expect(m1.get('c')).toBe('');
		expect(m1.get('d')).toBe(2);
		expect(m1.get('e')).toBe(0);
	});

	test('可以通过 process 方法定义一个属性设置格式化方法，确保值的按预期格式设定', () => {
		const m1 = new $model({
			a: 1
		});

		m1.process('a', {
			set(value) {
				return parseInt(value, 10) || 0;
			}
		});

		m1.set('a', '5');
		expect(m1.get('a')).toBe(5);
	});

	test('可以通过 process 方法定义一个属性取值格式化方法，确保获得预期格式的值', () => {
		const m1 = new $model({
			a: 1
		});

		m1.process('a', {
			get(value) {
				return value + 'px';
			}
		});

		m1.set('a', 5);
		expect(m1.get('a')).toBe('5px');
	});

	test('可以通过 processors 对象批量设置预处理方法', () => {
		const Model = $model.extend({
			processors: {
				a: {
					set(value) {
						return Math.abs(value);
					},
					get(value) {
						return value + 'px';
					}
				},
				b: {
					get(value) {
						return value + 'vw';
					}
				}
			}
		});

		const m1 = new Model({
			'a': -2
		});
		m1.set('b', 3);

		expect(m1.get('a')).toBe('2px');
		expect(m1.get('b')).toBe('3vw');
	});

	test('可以在 events 属性中绑定事件进行属性关联运算', () => {
		const Model = $model.extend({
			defaults: {
				a: 1,
				b: 2
			},
			events: {
				'change:a': 'updateB'
			},
			updateB() {
				this.set('b', this.get('a') + 10);
			}
		});

		const m1 = new Model();
		m1.set('a', 2);

		expect(m1.get('b')).toBe(12);
	});

	test('可以在 events 属性中为一个属性变更事件绑定多个函数', () => {
		const Model = $model.extend({
			defaults: {
				a: 1,
				b: 2
			},
			events: {
				'change:a': 'updateB updateC'
			},
			updateB() {
				this.set('b', this.get('a') + 10);
			},
			updateC() {
				this.set('c', this.get('a') + 20);
			}
		});

		const m1 = new Model();
		m1.set('a', 2);

		expect(m1.get('b')).toBe(12);
		expect(m1.get('c')).toBe(22);
	});

	test('在 events 属性中添加了属性映射函数，在对象初始化接收选项参数时会自动执行', () => {
		const Model = $model.extend({
			defaults: {
				a: 1,
				b: 2
			},
			events: {
				'change:a': 'updateB'
			},
			updateB() {
				this.set('b', this.get('a') + 10);
			}
		});

		const m1 = new Model({
			'a': 2
		});

		expect(m1.get('b')).toBe(12);
	});

	test('属性变化会触发模型的 change 事件，每个属性变化都会触发', () => {
		const m1 = new $model({
			a: 1,
			b: 2
		});

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		m1.set('a', 2);
		m1.set('b', 3);
		m1.set('c', 4);

		expect(count).toBe(3);
	});

	test('向 set 方法传递一个对象作为参数时，多个属性变化仅触发模型的 change 事件一次', () => {
		const m1 = new $model({
			a: 1,
			b: 2
		});

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		let aChanged = 0;
		m1.on('change:a', () => {
			aChanged++;
		});

		let bChanged = 0;
		m1.on('change:b', () => {
			bChanged++;
		});

		m1.set({
			'a': 2,
			'b': 3
		});

		expect(count).toBe(1);
		expect(aChanged).toBe(1);
		expect(bChanged).toBe(1);
	});

	test('确保模型实例各自的操作不会影响到彼此。', () => {
		const m1 = new $model({
			a: 1,
			b: 2
		});
		const m2 = new $model({
			a: 2,
			b: 1
		});
		m1.set('a', 3);
		m2.set('b', 4);

		expect(m1.get('a')).toBe(3);
		expect(m1.get('b')).toBe(2);
		expect(m2.get('a')).toBe(2);
		expect(m2.get('b')).toBe(4);
	});

	test('可在实例绑定对应属性的 change 事件', () => {
		const m1 = new $model({
			a: 1
		});

		m1.on('change:a', () => {
			m1.set('b', m1.get('a') + 10);
		});

		m1.set('a', 2);

		expect(m1.get('b')).toBe(12);
	});

	test('属性变化会触发模型的 change 事件，每个属性变化都会触发对应 change 事件', () => {
		const m1 = new $model({
			a: 1,
			b: 2
		});

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		let aChanged = false;
		m1.on('change:a', () => {
			aChanged = true;
		});

		let bChanged = false;
		m1.on('change:b', () => {
			bChanged = true;
		});

		let cChanged = false;
		m1.on('change:c', () => {
			cChanged = true;
		});

		let dChanged = false;
		m1.on('change:d', () => {
			dChanged = true;
		});

		m1.set('a', 1);
		m1.set('b', 2);
		m1.set('c', 3);
		m1.set('d');

		expect(count).toBe(1);
		expect(aChanged).toBe(false);
		expect(bChanged).toBe(false);
		expect(cChanged).toBe(true);
		expect(dChanged).toBe(false);
	});

	test('set 方法不传递第二个参数时，或者第二个参数为 undefined 时，不会增加模型的键值对数量，也不会触发 change 事件', () => {
		const m1 = new $model({
			a: 1
		});

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		let bChanged = 0;
		m1.on('change:b', () => {
			bChanged++;
		});

		let cChanged = 0;
		m1.on('change:b', () => {
			cChanged++;
		});

		m1.set('b');
		m1.set('c', undefined);

		expect(m1.keys().length).toBe(1);
		expect(count).toBe(0);
		expect(bChanged).toBe(0);
		expect(cChanged).toBe(0);
	});

	test('可以通过属性名对应的 change 事件，拿到 change 发生之前的值', () => {
		const m1 = new $model({
			a: 1
		});

		let prev = 0;
		m1.on('change:a', function(prevA) {
			prev = prevA;
		});

		m1.set('a', 2);

		expect(prev).toBe(1);
	});

	test('change 事件发生时，当前属性的值已经发生改变', () => {
		const m1 = new $model({
			a: 1
		});

		let now2 = 0;
		m1.on('change', () => {
			now2 = m1.get('a');
		});

		let now1 = 0;
		m1.on('change:a', () => {
			now1 = m1.get('a');
		});

		m1.set('a', 2);

		expect(now1).toBe(2);
		expect(now2).toBe(2);
	});

	test('属性变更用 === 来判断，数据与类型必须一致', () => {
		const m1 = new $model({
			a: 1
		});

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		m1.set('a', '1');

		expect(count).toBe(1);
	});

	test('可以设置一个属性为对象，通过get方法访问这个属性，获取到的是这个对象的拷贝', () => {
		const m1 = new $model({
			a: {
				a: 1
			},
			b: [1, 2]
		});

		let a = m1.get('a');
		let b = m1.get('b');

		a.a = 2;
		b.unshift(3);

		expect(m1.get('a').a).toBe(1);
		expect(b[0]).toBe(3);
		expect(m1.get('b')[0]).toBe(1);
	});

	test('get 方法不传参数可以获取这个模型数据的拷贝', () => {
		const m1 = new $model({
			a: {
				a: 1
			},
			b: [1, 2]
		});

		const obj = m1.get();
		obj.a.a = 2;
		obj.b.unshift(3);

		expect(obj.a.hasOwnProperty('a')).toBe(true);
		expect(Object.keys(obj.a).length).toBe(1);
		expect(obj.a.a).toBe(2);
		expect(m1.get('a').a).toBe(1);

		expect(obj.b.length).toBe(3);
		expect(obj.b.join('')).toBe('312');
		expect(m1.get('b')[0]).toBe(1);
	});

	test('用 keys 方法可以获取模型上的所有键名', () => {
		const m1 = new $model({
			a: 1
		});

		m1.set('b', 1);

		expect(m1.keys()[0]).toBe('a');
		expect(m1.keys()[1]).toBe('b');
		expect(m1.keys().length).toBe(2);
	});

	test('用 remove 方法移除模型上的一个键值对，同样可以触发 change 事件', () => {
		const m1 = new $model({
			a: 1
		});

		let aChanged = 0;
		m1.on('change:a', () => {
			aChanged++;
		});

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		m1.set('b', 1);
		m1.remove('a');

		expect(m1.get('a')).toBeUndefined();
		expect(m1.get().hasOwnProperty('a')).toBe(false);
		expect(m1.get('b')).toBe(1);
		expect(aChanged).toBe(1);
		expect(count).toBe(2);
	});

	test('用 clear 方法移除模型上的所有键值对，仅触发模型 change 事件 1 次，但会分别触发属性 change 事件', () => {
		const m1 = new $model({
			a: 1
		});

		let aChanged = 0;
		m1.on('change:a', () => {
			aChanged++;
		});

		let bChanged = 0;
		m1.on('change:b', () => {
			bChanged++;
		});

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		m1.set('b', 1);
		m1.clear();

		expect(m1.keys().length).toBe(0);
		expect(aChanged).toBe(1);
		expect(bChanged).toBe(2);
		expect(count).toBe(2);
	});

	test('用 destroy 方法销毁模型，会解绑模型上的所有事件，不触发任何 change 事件', () => {
		const m1 = new $model({
			a: 1
		});

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		let aChanged = 0;
		m1.on('change:a', () => {
			aChanged++;
		});

		m1.set('a', 2);
		m1.destroy();
		m1.set('a', 3);

		expect(count).toBe(1);
		expect(aChanged).toBe(1);
	});

	test('用 destroy 方法销毁模型，该模型绑定的事件无法再被触发', () => {
		const m1 = new $model({
			a: 1
		});

		m1.destroy();

		let count = 0;
		m1.on('change', () => {
			count++;
		});

		let aChanged = 0;
		m1.on('change:a', () => {
			aChanged++;
		});

		m1.set('a', 2);

		expect(count).toBe(0);
		expect(aChanged).toBe(0);
	});

	test('用 destroy 方法销毁模型，模型上所有的数据都被清空为 undefined', () => {
		const m1 = new $model({
			a: 1
		});

		m1.destroy();

		expect(Object.keys(m1.get()).length).toBe(0);
		expect(m1.get('a')).toBeUndefined();
	});
});

// describe('mvc/view', function() {
// 	var $view = window.sporeKit.mvc.View;
// 	this.timeout(3000);

// 	it('mvc/view exists', function() {
// 		expect($view).to.be.a('function');
// 	});

// 	it('设置 node 选项为元素 id 或者元素本身，可设置视图的根节点。', function() {

// 		var id = $getUniqueKey();
// 		var node = $('<div></div>');
// 		node.attr('id', id)
// 			.css('display', 'none')
// 			.appendTo(document.body);

// 		var TestView = $view.extend({
// 			defaults: {
// 				node: '#' + id
// 			}
// 		});

// 		var obj1 = new $view({
// 			node: '#' + id
// 		});

// 		var obj2 = new TestView();
// 		var obj3 = new TestView({
// 			node: node.get(0)
// 		});

// 		expect(obj1.role('root').attr('id')).to.equal(id);
// 		expect(obj2.role('root').attr('id')).to.equal(id);
// 		expect(obj3.role('root').attr('id')).to.equal(id);

// 		node.remove();

// 	});

// 	it('设置 template 选项为 html 字符串，或者字符串数组，组件初始化后，可直接创建视图 dom。', function() {

// 		var id1 = $getUniqueKey();
// 		var id2 = $getUniqueKey();

// 		var obj1 = new $view({
// 			template: '<div id="' + id1 + '"></div>'
// 		});

// 		var obj2 = new $view({
// 			template: [
// 				'<div id="' + id2 + '">',
// 				'</div>'
// 			]
// 		});

// 		expect(obj1.role('root').attr('id')).to.equal(id1);
// 		expect(obj2.role('root').attr('id')).to.equal(id2);

// 	});

// 	it('同时设置 template 和 node ，优先使用 node 识别根元素。', function() {

// 		var id1 = $getUniqueKey();
// 		var id2 = $getUniqueKey();

// 		var node = $('<div></div>');
// 		node.attr('id', id1)
// 			.css('display', 'none')
// 			.appendTo(document.body);

// 		var obj = new $view({
// 			node: '#' + id1,
// 			template: '<div id="' + id2 + '"></div>'
// 		});

// 		expect(obj.role('root').attr('id')).to.equal(id1);

// 		node.remove();
// 	});

// 	it('使用 role 方法可获取根元素内部标记了 role 属性的元素。', function() {

// 		var id = $getUniqueKey();
// 		var obj = new $view({
// 			template: [
// 				'<div">',
// 				'<div role="member" id="' + id + '"></div>',
// 				'</div>'
// 			]
// 		});

// 		expect(obj.role('member').attr('id')).to.equal(id);

// 	});

// 	it('可通过 role 选项指定选择器与对应的角色名称。', function() {

// 		var id = $getUniqueKey();

// 		var TestView = $view.extend({
// 			defaults: {
// 				template: [
// 					'<div">',
// 					'<div type="member" id="' + id + '"></div>',
// 					'</div>'
// 				],
// 				role: {
// 					'member': '[type="member"]'
// 				}
// 			}
// 		});

// 		var obj = new TestView();

// 		expect(obj.role('member').attr('id')).to.equal(id);

// 	});

// 	it('可以用 resetRoles 方法清除视图缓存的角色 dom 元素。', function() {

// 		var id1 = $getUniqueKey();
// 		var id2 = $getUniqueKey();
// 		var obj = new $view({
// 			template: [
// 				'<div">',
// 				'<div role="member" id="' + id1 + '"></div>',
// 				'</div>'
// 			]
// 		});

// 		expect(obj.role('member').attr('id')).to.equal(id1);

// 		obj.resetRoles();
// 		obj.role('root').html('<div role="member" id="' + id2 + '"></div>');

// 		expect(Object.keys(obj.nodes).length).to.equal(1);
// 		expect(obj.role('member').attr('id')).to.equal(id2);
// 		expect(Object.keys(obj.nodes).length).to.equal(2);

// 	});

// 	it('在 events 对象上可以绑定代理事件', function() {

// 		var TPL = {
// 			box: [
// 				'<div>',
// 				'<button data-val="3"></button>',
// 				'</div>'
// 			]
// 		};

// 		var TestView = $view.extend({
// 			defaults: {
// 				template: TPL.box
// 			},
// 			events: {
// 				'button click': 'onBtnClick'
// 			},
// 			build() {
// 				this.arr = [];
// 				this.role('root').appendTo(document.body);
// 			},
// 			onBtnClick: function(evt) {
// 				var node = $(evt.currentTarget);
// 				this.arr.push(node.attr('data-val'));
// 			}
// 		});

// 		var obj = new TestView();
// 		obj.role('root').append('<button data-val="5"></button>');

// 		obj.role('root').find('button').each(function() {
// 			$(this).trigger('click');
// 		});

// 		expect(obj.arr.join('')).to.equal('35');

// 		obj.role('root').remove();

// 	});

// 	it('在 events 上对一个选择器可以绑定多个代理事件', function() {

// 		var TPL = {
// 			box: [
// 				'<div>',
// 				'<button data-val="3"></button>',
// 				'</div>'
// 			]
// 		};

// 		var TestView = $view.extend({
// 			defaults: {
// 				template: TPL.box
// 			},
// 			events: {
// 				'button click': 'gather add'
// 			},
// 			build: function() {
// 				this.arr = [];
// 				this.val = 0;
// 				this.role('root').appendTo(document.body);
// 			},
// 			gather: function(evt) {
// 				var node = $(evt.currentTarget);
// 				this.arr.push(node.attr('data-val'));
// 			},
// 			add: function(evt) {
// 				var node = $(evt.currentTarget);
// 				this.val = this.val + parseInt(node.attr('data-val'), 10);
// 			}
// 		});

// 		var obj = new TestView();
// 		obj.role('root').append('<button data-val="5"></button>');

// 		obj.role('root').find('button').each(function() {
// 			$(this).trigger('click');
// 		});

// 		expect(obj.arr.join('')).to.equal('35');
// 		expect(obj.val).to.equal(8);

// 		obj.role('root').remove();

// 	});

// 	it('配置 events 选项可自定事件代理。', function() {

// 		var TPL = {
// 			box: [
// 				'<div>',
// 				'<button role="button"></button>',
// 				'</div>'
// 			]
// 		};

// 		var TestView = $view.extend({
// 			defaults: {
// 				template: TPL.box
// 			},
// 			events: {
// 				'button click': 'method1'
// 			},
// 			build: function() {
// 				this.val = 0;
// 				this.role('root').appendTo(document.body);
// 			},
// 			method1: function(evt) {
// 				this.val = 1;
// 			},
// 			method2: function(evt) {
// 				this.val = 2;
// 			}
// 		});

// 		var obj1 = new TestView();
// 		var obj2 = new TestView({
// 			events: {
// 				'button click': 'method2'
// 			}
// 		});

// 		obj1.role('button').trigger('click');
// 		obj2.role('button').trigger('click');

// 		expect(obj1.val).to.equal(1);
// 		expect(obj2.val).to.equal(2);

// 		obj1.role('root').remove();
// 		obj2.role('root').remove();
// 	});

// 	it('view 组件提供 destroy 方法清除缓存对象。', function() {

// 		var TPL = {
// 			box: [
// 				'<div>',
// 				'<button role="button"></button>',
// 				'</div>'
// 			]
// 		};

// 		var TestView = $view.extend({
// 			defaults: {
// 				template: TPL.box
// 			},
// 			events: {
// 				'button click': 'method'
// 			},
// 			build: function() {
// 				this.val = 0;
// 				this.role('root').appendTo(document.body);
// 			},
// 			method: function(evt) {
// 				this.val = 1;
// 			}
// 		});

// 		var obj = new TestView();
// 		obj.destroy();

// 		expect(Object.keys(obj.nodes).length).to.equal(0);

// 		obj.role('button').trigger('click');
// 		expect(Object.keys(obj.nodes).length).to.equal(2);

// 		expect(obj.val).to.equal(0);

// 		obj.role('root').remove();
// 	});

// });
