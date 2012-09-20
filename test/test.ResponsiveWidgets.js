
describe('Condition parser', function(){
  var RW = null;

  beforeEach(function(){
    RW = new ResponsiveWidgets();
  });

  it('should take a opened interval as condition', function(){
    var r = RW._parseCondition('>20 <50');
    assert.equal(r.from, 21);
    assert.equal(r.to, 49);
  });
  it('should take a closed interval as condition', function(){
    var r = RW._parseCondition('>=20 <=50');
    assert.equal(r.from, 20);
    assert.equal(r.to, 50);
  });
  it('should take a static value as condition', function(){
    var r = RW._parseCondition('=20');
    assert.equal(r.from, 20);
    assert.equal(r.to, 20);
  });
  it('should take a interval with unbounded value as condition', function(){
    var r = RW._parseCondition('>=20');
    assert.equal(r.from, 20);
    assert.equal(r.to, null);
  });
});

describe('Add method', function(){
  var RW;

  beforeEach(function(){
    RW = new ResponsiveWidgets();
  });

  it('should take attach and detach functions', function(){
    var attach = function(){return 'attach';},
        detach = function(){return 'detach';}
    
    RW.add('>20 <50', attach, detach);
    assert.equal(RW.callbacks[0].attach, attach);
    assert.equal(RW.callbacks[0].detach, detach);
  });
  it('should take attachable object', function(){
    var obj = null,
        callback = null,
        objClass = function(){};

    objClass.prototype = {
      attach : function(){return 'attach';},
      detach : function(){return 'detach';},
    };
    obj = new objClass();

    RW.add('>20 <50', obj);
    callback = RW.callbacks[0];
    //attach and detach should be anonymous function
    expect(callback.attach.isPrototypeOf(objClass)).to.be.false;
    expect(callback.detach.isPrototypeOf(objClass)).to.be.false;
    expect(callback.attach.toString()).to.equal('function (){}');
    expect(callback.detach.toString()).to.equal('function (){}');

    expect(callback.obj).to.be.instanceof(objClass);
  });
});

describe('Check method', function(){
  var RW,
      clearRW = function(){
        RW = new ResponsiveWidgets();
      };



  describe('(with attach and detach functions)', function(){
    var attachResult = null,
        detachResult = null,
        attach = function(val){attachResult = val;return 'attach';},
        detach = function(val){detachResult = val;return 'detach';};

    before(function(){
      clearRW();
      RW.add('>20 <50', attach, detach);
      assert.equal(RW.callbacks[0].attach, attach);
      assert.equal(RW.callbacks[0].detach, detach);
    });

    it('should execute attach when attached is false', function(){
      expect(RW.callbacks[0].attached).to.be.false;
      assert.equal(attachResult, null);
      RW.check(21);
      expect(RW.callbacks[0].attached).to.be.true;
      assert.equal(attachResult, 21);

      RW.check(30)
      expect(RW.callbacks[0].attached).to.be.true;
      assert.equal(attachResult, 21);
    });

    it('should execute detach when attached is true', function(){
      expect(RW.callbacks[0].attached).to.be.true;
      assert.equal(detachResult, null);
      RW.check(51);
      expect(RW.callbacks[0].attached).to.be.false;
      assert.equal(detachResult, 51);

      RW.check(60)
      expect(RW.callbacks[0].attached).to.be.false;
      assert.equal(detachResult, 51);
    });

  });

});