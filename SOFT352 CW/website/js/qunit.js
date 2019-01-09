// Tests for snake game javascript
QUnit.test("#Testing if main function exist", function(assert){
  assert.ok(typeof main === 'function', "main is a function")
})

QUnit.test("#Testing if food function exist", function(assert){
  assert.ok(typeof food === 'function', "food is a function")
})

QUnit.test("#Testing if grow function exist", function(assert){
  assert.ok(typeof grow === 'function', "grow is a function")
})

QUnit.test("#Testing if wall function exist", function(assert){
  assert.ok(typeof wall === 'function', "wall is a function")
})

QUnit.test("#Testing if levels function exist", function(assert){
  assert.ok(typeof levels === 'function', "levels is a function")
})

QUnit.test("#Testing if collisions function exist", function(assert){
  assert.ok(typeof collisions === 'function', "collisions is a function")
})

QUnit.test("#Testing if nextlevel function exist", function(assert){
  assert.ok(typeof nextlevel === 'function', "nextlevel is a function")
})

QUnit.test("#Testing if gameover function exist", function(assert){
  assert.ok(typeof gameover === 'function', "gameover is a function")
})

QUnit.test("#Testing if score function exist", function(assert){
  assert.ok(typeof score === 'function', "score is a function")
})

QUnit.test("#Testing if html elements exist", function(assert){
    assert.equal($(".navbar").prop("tagName"), "DIV", "checking if div class navbar exists");
});

QUnit.test("#Testing if html elements exist", function(assert){
    assert.equal($(".section").prop("tagName"), "SECTION", "checking if section class section exists");
});

QUnit.test("#Testing font size of html elements", function(assert){
    assert.equal($(".image1text").css("font-size"), "40px", "Checking that image1text font size is 40px");
    assert.equal($("#button").css("font-size"), "30px", "Checking that navbar button font size is 30px");
});
