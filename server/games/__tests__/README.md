# Guidelines for Game Tests (Server Side)

**Game tests should not be treated the same as tests for regular, typical classes**. A game is not quite the same as a typical class. A typical class has regular methods to test that can often be handled in isolation. But a game inherently has methods that are coupled because a game will always follow a path from start to finish, updating its state along the way. To an extent, it's impossible to test a game's methods in isolation, especially as the game gets more complex. Due to the complexity of testing a card game, we've established some guidelines to improve code readability and consistency.

Bold statements are provided for quick skimming.

1. [Write Tests within an "Overall Flow"](#write-tests-within-an-"overall-flow")
2. [Write the Tests in a Reasonable Order](#write-the-tests-in-a-reasonable-order)
3. [Maximize the Number of Tests in a Single "Flow"](#maximize-the-number-of-tests-in-a-single-"flow")
4. [Minimize the Number of "Flows" You Need to Create](#minimize-the-number-of-"flows"-you-need-to-create)
5. [Miscellaneous](#miscellaneous)
   - [Testing Preconditions](#testing-preconditions)
   - [Updating the Shared Game State Variable](#updating-the-shared-game-state-variable)
   - [Handling Large Updates to Game State](#handling-large-updates-to-game-state)

## Write Tests within an "Overall Flow"

**Most of the tests for a game should be written "within a flow", as if the game was actually playing out.** This means that `test X` will be impacted by the tests that came before it. (`Codenames.test.ts` is a good example of this.) There are 2 primary reasons for this:

1. **It simplifies setup.** If the tests are treated as if they follow an overall flow or process, then `test X` can rely on the fact that previous tests have done all the necessary setup. (The correct player is active, the current number of guesses is correct, etc.) Otherwise, for each individual unit test, there would be an increasingly large amount of boiler plate for each test as you get later in the game. This is confusing, messy, and inefficient. (In Codenames, in order to unit test revealing a card "in isolation", you'd first have to create the players, assign the appropriate teams and roles, instantiate a game, start the game, and give a valid code before you can even think about actually writing out the test to reveal a card.)
2. **It's more realistic.** Realistically, in a game, you will do the proper setup, start the game, and go through a series of state changes in response to player actions until the game is won. Writing tests that impact each other within an "overall flow" is similar to playing the actual game and testing assertions while the game plays out -- making it more realistic. This is similar to what you'd do if you did the tests by hand. But since the tests are automated, you'll be able to rely on those instead of having to test the use cases repeatedly (some of which you may forget) by yourself.

## Write the Tests in a Reasonable Order

Writing the tests within an "overall flow" requires the tests to be ordered properly. **The order of the tests should follow the flow of the game.** This adds clarity and minimizes the amount of boilerplate per test. So, for instance, for Codenames, test starting the game before giving codes, and test giving codes before revealing cards.

To this extent, your tests should be properly grouped depending on what part of the game flow you're in. **To help with grouping tests by location in the game flow, add things like comments to specify which part of the flow you're currently in.**

## Maximize the Number of Tests in a Single "Flow"

You should order the tests in such a way that the maximum number of test cases can be verified within a single "flow". In addition to writing your tests in a reasonable order, this often means **testing any relevant error cases as early as possible**. Since errors typically don't result in a progressive change in game state, you can test as many errors as you like in one section of the tests before moving onto the next section.

For instance, _when_ you test starting the game, _always_ test the error cases for starting the game _as soon as possible_. _When_ you test revealing a Codenames card, _always_ test the error cases for revealing a card _as soon as possible_. (Some error cases may require a certain action to be taken before the error can occur.)

_Relevant_ error cases is the important part here: You should not be testing error cases for revealing a card in the middle of your set of tests for starting the game. Remember, your tests should be grouped and ordered by the overall flow of the game. By testing relevant error cases as soon as possible and grouping them in the correct places in the game flow, the structure of the tests becomes more predictable -- making the code more readable.

Maximizing the number of tests in a given flow does not stop at error cases. For example, you should test as many use cases as you can before forcing a win condition.

Naturally, it will not always be possible to test all aspects of a game in a single flow. For instance, a _single_ game can only be won _once_. So if there are multiple win conditions, then some win conditions will have to be tested outside of the first flow.

## Minimize the Number of "Flows" You Need to Create

An individual "flow" requires creating a group of variables that can be shared between tests. This is fine. But if my multiple flows are created, then there will be multiple groups of variables shared between different sets tests. This is manageable if the code is structured well and the variables are clearly named, but it's best to keep the number of "flows" to 1 as much as possible.

If it is not possible to complete all tests within 1 flow, but there are hardly any test conditions left, then test the remaining use cases "in isolation", outside of a typical flow. These tests will use their own local variables, not the ones shared by the tests that follow a flow. **Out-of-flow tests should always be done last**; they should appear at the very end of the list of tests. **Remember to label the out-of-flow test group, just as you should label your different groups of tests by the part of the game flow they're in.**

If it is not possible to complete all tests within 1 flow, but a wide array of complex test conditions still exist, then make another flow for a new set of tests. Properly label and group your separate flows and shared test variables as needed! _However, bare in mind that for something as simple as a card game, this condition should almost never be reached_. (And _all_ the games here are card games.)

## Miscellaneous

### Testing Preconditions

Where deemed appropriate or useful, you can perform quick, early assertions in `test B` to make sure that things were properly set up by the previous `test A` (or an even earlier test). Do this within reason, however. Most of the time this is unnecessary, and it will make more sense to assume that the state was properly setup based on the order of the tests. Asserting on preconfigured conditions is mostly helpful for doing debugging if a certain test fails.

_Testing that the game was previously put in the correct state_ (`ACTIVE`, `INACTIVE`, etc.) _is always acceptable_.

### Updating the Shared Game State Variable

**The test game state variable that gets updated throughout an entire flow should always be reassigned when valid actions are taken.** If you're testing the result from a valid action, then assign the result to the shared game state variable and perform assertions on that.

**The test game state variable should never be reassigned when erroneous actions are taken.** If you need to test an error, assign the state resulting from an erroneous action to a local variable that you'll only be observing within that test.

**When testing an error case, you should verify that the game state is the same as it was before the error occurred, excluding the error message.**

### Handling Large Updates to Game State

Generally, when validating an enormous update after an action (eg. players, actions, and cards being properly setup after a game start), you may consider separating the test of successfully performing the action (eg. starting the game) from the test verifying all the updates. However, _if_ you do this, _do not_ separate the update verifications into individual tests. Do all the update verifications within a single test to help clarify that it was the previous test that caused the large update. And place said test immediately after the action that caused the enormous update. (Structure your code so that this tip has to be used as minimally as possible.)

---

Having read and understood these rules, you'll be most helped by reading through `Codenames.test.ts` to solidify your understanding further. Reading the test code will also help you learn and understand the few things not discussed here. Please do this before adding or editing any tests. (And please add tests before committing any new code.)

If any superior rule system is discovered, it can be used to update or replace the existing rule system -- as long as the tests are updated to adhere to the rules in the same commit. Remember: The ultimate goal is code brevity and code clarity.
