import { TestClass } from './TestClass';

export class SubClass {
  private _testclass: TestClass;

  constructor(obj: TestClass) {
    this._testclass = obj;
  }
}
