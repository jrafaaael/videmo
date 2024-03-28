# 🎥 videmo

Record your screen and create engaging videos without video-editing skills!

## Contributing

Any contributions you make are greatly appreciated. We welcome any idea that help us (the Videmo's community) to improve the project. Some ways to contribute to Videmo are:

1. Simply start using [Videmo](https://videmo.vercel.app/) :)
2. Raising an issue

   - Before submitting a new issue, check if it already exists in [issues](https://github.com/jrafaaael/videmo/issues)
   - **One issue, one bug:** Please report a single bug per issue
   - In title, start it with `[BUG]: `, then a descriptive title for your issue (e. g.: [BUG]: Recording is broken in Firefox)
   - Add `bug` label
   - Include screenshots or videos in your issue whenever needed

3. Contribute with your ideas!

   - Before submitting a new idea, check if it already exists in [Planned features](https://github.com/jrafaaael/videmo?tab=readme-ov-file#planned-features) or if someone [already suggest it](https://github.com/jrafaaael/videmo/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)
   - In title, start it with `[FEATURE REQUEST]: `, then a descriptive title for your feature (e. g.: [FEATURE REQUEST]: GIF export)
   - Add `enhancement` label

4. Submitting a Pull Request

   - Before submitting a new PR, check if [it already is being developed](https://github.com/jrafaaael/videmo/pulls)
   - **DON'T USE `master` BRANCH TO DEVELOP YOUR PR!**
   - If your PR refers to or fixes an issue, be sure to add `refs #XXX` or `fixes #XXX` to the PR description. Replacing `XXX` with the respective issue number. See more about [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)
   - We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our pull request titles (and commit messages). For types we use the [Angular's convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type). If a change don't apply to any type of the Angular's Convention, then use `chore`

## Planned features

These are some features that we want to develop in the short, medium and long term. This doesn't mean that a long-term feature can be developed and shipped before a short-term one

| Short-term                                     | Status | Medium-term      | Status | Long-term            | Status |
| ---------------------------------------------- | ------ | ---------------- | ------ | -------------------- | ------ |
| Store videos                                   | ✅     | Selfie recording | ❌     | Auto zoom            | ❌     |
| Upload videos (recording)                      | ✅     | Upload audio     | ❌     | Mobile               | ❌     |
| Crop                                           | ❌     | Clips            | ❌     | Auto trim low-volume | ❌     |
| Trim                                           | ❌     | Layouts          | ❌     | 3D renderer          | ❌     |
| Multiple export aspect ratios (mobile, square) | ❌     | Mockups          | ❌     |                      |        |
|                                                |        | Subtitles        | ❌     |                      |        |

> ✅: Done
>
> ❌: No done

## Known bugs

1. Some browser APIs used in Videmo only works in Chromium-based browsers (tested on Chrome only so far)
