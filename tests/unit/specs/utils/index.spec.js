import {
    assert,
    extend,
} from '@/utils';


describe('Utils: assert', () => {
    it('should do nothing if condition is truthy', () => {
        expect(assert(true, 'assert: true')).toBeUndefined();
    });

    it('should raise error if condition is falsy', () => {
        /* You must wrap the code in a function, otherwise the error
         * will not be caught and the assertion will fail.
         *
         * @see https://jestjs.io/docs/en/23.x/expect#tothrowerror
         */
        expect(() => assert(false, 'assert: false')).toThrow();
    });
});

describe('Utils: extend', () => {
    it('should create inheritance of prototypes', () => {
        function foo() {}
        function bar() {}

        // Parent object
        function A() {}
        A.prototype = {
            foo,
        };

        // Child object
        function B() {}
        B.prototype = {
            bar,
        };

        extend(B, A);

        const b = new B();

        expect(b instanceof B).toBeTruthy();
        expect(b instanceof A).toBeTruthy();
        expect(b).toHaveProperty('constructor', B);
        expect(b).toHaveProperty('bar', bar);
        expect(b).toHaveProperty('foo', foo);
    });
});
