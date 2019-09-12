import {
    assert,
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
