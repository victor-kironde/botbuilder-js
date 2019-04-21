const { ExpressionEngine } = require('../');
const { Extensions } = require('botbuilder-expression');
const assert = require('assert');

const invalidExpressions = [
  "a+",
  "a+b*",
  "fun(a, b, c",
  "func(A,b,b,)",
  "a.#title",
  "\"hello'"
];

const badExpressions =
  // General test
  ["func()", // no such func
  "a.func()", // no such function
  "(1.foreach)()",// error func
  "('str'.foreach)()",// error func

  // Operators test
  "'1' + 2", // params should be number
  "'1' * 2", // params should be number
  "'1' - 2", // params should be number
  "'1' / 2", // params should be number
  "'1' % 2", // params should be number
  "'1' ^ 2", // params should be number
  "'string'&one", // $ can only accept string parameter
  "1/0", // can not divide 0

  // String functions test
  "concat(one, hello)", // concat can only accept string parameter
  "length(one, 1)", // length can only have one param
  "replace(hello)", // replace need three parameters
  "replace(one, 'l', 'k')", // replace only accept string parameter
  "replace('hi', 1, 'k')", // replace only accept string parameter
  "replace('hi', 'l', 1)", // replace only accept string parameter
  "replaceIgnoreCase(hello)", // replaceIgnoreCase need three parameters
  "replaceIgnoreCase(one, 'l', 'k')", // replaceIgnoreCase only accept string parameter
  "replaceIgnoreCase('hi', 1, 'k')", // replaceIgnoreCase only accept string parameter
  "replaceIgnoreCase('hi', 'l', 1)", // replaceIgnoreCase only accept string parameter
  "split(hello)", // split need two parameters
  "split(one, 'l')", // split only accept string parameter
  "split(hello, 1)", // split only accept string parameter
  "substring(hello, 0.5)", // the second parameter of substring must be integer
  "substring(one, 0)", // the first parameter of substring must be string
  "substring(hello, 10)", // the start index is out of the range of the string length
  "substring(hello, 0, 10)", // the length of substring is out of the range of the original string
  "toLower(one)", // the parameter of toLower must be string
  "toLower('hi', 1)", // should have 1 param
  "toUpper(one)", // the parameter of toUpper must be string
  "toUpper('hi', 1)", // should have 1 param
  "trim(one)", // the parameter of trim must be string
  "trim('hi', 1)", // should have 1 param

  // Logical comparison functions test
  "greater(one, hello)", // string and integer are not comparable
  "greater(one)", // greater need two parameters
  "greaterOrEquals(one, hello)", // string and integer are not comparable
  "greaterOrEquals(one)", // function need two parameters
  "less(one, hello)", // string and integer are not comparable
  "less(one)", // function need two parameters
  "lessOrEquals(one, hello)", // string and integer are not comparable
  "lessOrEquals(one)", // function need two parameters
  "equals(one)", // equals must accept two parameters
  "exists(1, 2)", // function need one parameter
  //"if(!exists(one), one, hello)", // the second and third parameters of if must the same type
  "not(false, one)", // function need one parameter

  // Conversion functions test
  "float(hello)", // param shoud be float format string
  "float(hello, 1)", // shold have 1 param
  "int(hello)", // param shoud be int format string
  "int(1, 1)", // shold have 1 param
  "string(hello, 1)", // shold have 1 param
  "bool(false, 1)", // shold have 1 param

  // Math functions test
  "max(hello, one)", // param should be number
  "max()", // function need 1 or more than 1 parameters
  "min(hello, one)", // param should be number
  "min()", // function need 1 or more than 1 parameters
  "add(hello, 2)", // param should be number
  "add()", // arg count doesn't match
  "add(five, six)", // no such variables
  "add(one)", // add function need two or more parameters
  "sub(hello, 2)", // param should be number
  "sub()", // arg count doesn't match
  "sub(five, six)", // no such variables
  "sub(one)", // sub function need two or more parameters
  "mul(hello, one)", // param should be number
  "mul(one)", // mul function need two or more parameters
  "div(one, 0)", // one cannot be divided by zero
  "div(one)", // div function need two or more parameters
  "div(hello, one)", // string hello cannot be divided
  "exp(2, hello)", // exp cannot accept parameter of string
  "mod(1, 0)", // mod cannot accept zero as the second parameter
  "mod(5.5, 2)", //  param should be integer
  "mod(5, 2.1)", //  param should be integer
  "mod(5, 2.1 ,3)", // need two params
  "rand(5, 6.1)", //  param should be integer
  "rand(5)", // need two params
  "rand(7, 6)", //  minvalue cannot be greater than maxValue

  // Date and time function test
  "addDays('errortime', 1)",// error datetime format
  "addDays(timestamp, 'hi')",// second param should be integer
  "addDays(timestamp)",// should have 2 or 3 params
  "addDays(timestamp, 1,'yyyy', 2)",// should have 2 or 3 params
  "addHours('errortime', 1)",// error datetime format
  "addHours(timestamp, 'hi')",// second param should be integer
  "addHours(timestamp)",// should have 2 or 3 params
  "addHours(timestamp, 1,'yyyy', 2)",// should have 2 or 3 params
  "addMinutes('errortime', 1)",// error datetime format
  "addMinutes(timestamp, 'hi')",// second param should be integer
  "addMinutes(timestamp)",// should have 2 or 3 params
  "addMinutes(timestamp, 1,'yyyy', 2)",// should have 2 or 3 params
  "addSeconds('errortime', 1)",// error datetime format
  "addSeconds(timestamp, 'hi')",// second param should be integer
  "addSeconds(timestamp)",// should have 2 or 3 params
  "addSeconds(timestamp, 1,'yyyy', 2)",// should have 2 or 3 params
  "dayOfMonth('errortime')", // error datetime format
  "dayOfMonth(timestamp, 1)", //should have 1 param
  "dayOfWeek('errortime')", // error datetime format
  "dayOfWeek(timestamp, 1)", //should have 1 param
  "dayOfYear('errortime')", // error datetime format
  "dayOfYear(timestamp, 1)", //should have 1 param
  "month('errortime')", // error datetime format
  "month(timestamp, 1)", //should have 1 param
  "date('errortime')", // error datetime format
  "date(timestamp, 1)", //should have 1 param
  "year('errortime')", // error datetime format
  "year(timestamp, 1)", // should have 1 param
  "formatDateTime('errortime')", // error datetime format
  "formatDateTime(timestamp, 'yyyy', 1)", // should have 2 or 3 params
  "subtractFromTime('errortime', 'yyyy', 1)", // error datetime format
  "subtractFromTime(timestamp, 'yyyy', '1')", // third param should be integer
  "subtractFromTime(timestamp, 'yyyy', 1, 1)", // should have 3 params
  "dateReadBack('errortime', 'errortime')", // error datetime format
  "dateReadBack(timestamp)", // shold have two params
  "dateReadBack(timestamp, 'errortime')", // second param is invalid timestamp format
  "getTimeOfDay('errortime')", // error datetime format
  "getTimeOfDay(timestamp, timestamp)", // should have 1 param

  // collection functions test
  "sum(items, 'hello')",//should have 1 parameter
  "sum('hello')",//first param should be list
  "average(items, 'hello')",//should have 1 parameter
  "average('hello')",//first param should be list
  "contains('hello world', 'hello', 'new')",//should have 2 parameter
  "count(items, 1)", //should have 1 parameter
  "count(1)", //first param should be string, array or map
  "empty(1,2)", //should have two params
  "first(items,2)", //should have 1 param
  "last(items,2)", //should have 1 param
  "join(items, 'p1', 'p2','p3')",//builtin function should have 3 params, 
  //method extension should have 2-3 params
  "join(hello, 'hi')",// first param must list
  "join(items, 1)",// second param must string 
  "foreach(hello, item, item)",// first arg is not list
  "foreach(items, item)",//should have three parameters
  "foreach(items, item, item2, item3)",//should have three parameters
  "foreach(items, add(1), item)",// Second paramter of foreach is not an identifier

  // Object manipulation and construction functions test
  "json(1,2)", //should have 1 parameter
  "json(1)",//should be string parameter
  "json('{\"key1\":value1\"}')", // invalid json format string 
  "addProperty(json('{\"key1\":\"value1\"}'), 'key2','value2','key3')", //should have 3 parameter
  "addProperty(json('{\"key1\":\"value1\"}'), 1,'value2')", // second param should be string
  "setProperty(json('{\"key1\":\"value1\"}'), 'key2','value2','key3')", //should have 3 parameter
  "setProperty(json('{\"key1\":\"value1\"}'), 1,'value2')", // second param should be string
  "removeProperty(json('{\"key1\":\"value1\",\"key2\":\"value2\"}'), 1))",// second param should be string
  "removeProperty(json('{\"key1\":\"value1\",\"key2\":\"value2\"}'), '1', '2'))",// should have 2 parameter

  // Memory access test
  "property(bag, 1)",// second param should be string
  "Accessor(1)",// first param should be string
  "one[0]",  // one is not list
  "items[3]", // index out of range
  "items[one+0.5]", // index is not integer
];

const scope = {
  one: 1.0,
  two: 2.0,
  hello: "hello",
  world: "world",
  bag:
  {
    three: 3.0,
    set:
    {
      four: 4.0,
    },
    list: ["red", "blue"],
    index: 3,
    name: "mybag"
  },
  items: ["zero", "one", "two"],
  nestedItems:
    [
      { x: 1 },
      { x: 2 },
      { x: 3 },
    ],
  timestamp: "2018-03-15T13:00:00Z",
  turn:
  {
    entities:
    {
      city: "Seattle"
    },
    intents:
    {
      BookFlight: "BookFlight"
    }
  },
  dialog:
  {
    result:
    {
      title: "Dialog Title",
      subTitle: "Dialog Sub Title"
    }
  },
};

describe('expression functional test', () => {
  it('should get exception results for bad expressions', () => {
    for (const expression of badExpressions) {
      let isFail = false;
      const input = expression;
      try {
        var { value: actual, error } = new ExpressionEngine().parse(input).tryEvaluate(scope);
        if (error === undefined) {
          isFail = true;
        } else {
          console.log(error);
        }
      } catch (e) {
        console.log(e.message);
      }

      if (isFail) {
        assert.fail(`Test method ${input} did not throw expected exception`);
      }
    }
  });

  it('should get exception results for invalid expressions', () => {
    for (const expression of invalidExpressions) {
      const input = expression;
      try {
        new ExpressionEngine().parse(input);
        assert.fail(`Test expression ${input} did not throw expected exception`);
      } catch (e) {
        console.log(e.message);
      }
    }
  })
});