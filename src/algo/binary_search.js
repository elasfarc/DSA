const R = require("ramda");

const getMidIndex = R.compose(
  R.call(R.invoker(1, "floor"), R.__, Math),
  R.divide(R.__, 2),
  R.apply(R.add),
  R.props(["upper", "lower"])
);

const getMidElement = R.converge(R.nth, [getMidIndex, R.prop("list")]);
const getSearchValue = R.prop("searchValue");

var binarySearch = R.compose(
  R.prop("ans"),
  R.until(
    R.either(
      R.compose(R.not, R.compose(R.isNil, R.prop("ans"))),
      R.compose(R.apply(R.gt), R.props(["lower", "upper"]))
    ),
    R.cond([
      [
        R.converge(R.equals, [getSearchValue, getMidElement]),
        R.converge(R.assoc("ans"), [getMidIndex, R.identity]),
      ],
      [
        R.converge(R.lt, [getSearchValue, getMidElement]),
        R.converge(R.assoc("upper"), [
          R.compose(R.dec, getMidIndex),
          R.identity,
        ]),
      ],
      [
        R.converge(R.gt, [getSearchValue, getMidElement]),
        R.converge(R.assoc("lower"), [
          R.compose(R.inc, getMidIndex),
          R.identity,
        ]),
      ],
    ])
  ),
  R.converge(R.assoc("upper"), [
    R.compose(R.dec, R.length, R.prop("list")),
    R.assoc("lower", 0),
  ]),
  R.assoc("ans", null),
  R.converge(R.mergeLeft, [
    R.compose(R.objOf("list"), R.nthArg(0)),
    R.compose(R.objOf("searchValue"), R.nthArg(1)),
  ])
);

var binarySearch = R.curryN(2, binarySearch);

module.exports = binarySearch;
