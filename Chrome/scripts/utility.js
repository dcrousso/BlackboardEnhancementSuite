// Utility functions and classes to make life easier

/**
 * Class to make it easy to perform a series of functions
 * in order, after waiting for their callbacks to be called
 *
 * @class
 */
function OperationList() {
  this.funcs = [];
  this.data = {};
}

/**
 * This callback defines the steps and completion of an
 * operation.
 * @callback OperationList~operationCallback
 * @param {function} next - zero-argument function that
 *        can be called to go to the next operation in
 *        the list.
 * @param {object} data - an object stored in OperationList
 *        that operations can all share.
 */

/**
 * This method allows operations to be added in the "chaining"
 * style (i.e., opList.operation(...).operation(...)).
 *
 * @param {operationCallback} func - what the operation does
 * @return {OperationList} the original operation list class
 */
OperationList.prototype.operation = function(func) {
  this.funcs.push(func);
  return this;
}

/**
 * This method indicates that all operations have been added
 * so they can start being performed.
 */
OperationList.prototype.performInSequence = function() {
  var self = this;
  if (self.funcs.length > 0) {
    self.funcs.splice(0,1)[0](() => {
      self.performInSequence();
    }, self.data);
  }
}
