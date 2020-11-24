/**
 * Forces a process to wait until the provided `predicate` is satisfied.
 * @param predicate Function returning a `boolean`. Represents the condition you're waiting for.
 */
function waitFor(predicate: () => boolean): Promise<void> {
  return new Promise<void>(function (resolve) {
    setTimeout(function () {
      if (predicate()) {
        resolve();
      } else {
        waitFor(predicate).then(resolve);
      }
    }, 5);
  });
}

export default waitFor;
