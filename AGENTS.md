## Quy uoc dat ten

- Khi tao code moi, uu tien dat ten bien, ham, class, service, state va component bang tieng Viet khong dau theo dung nghiep vu.
- Khong dung cac ten tieng Anh chung chung nhu `data`, `item`, `value`, `handleSubmit` neu co the thay bang ten tieng Viet ro nghia.

## AI cleanup protocol

* End every task with `git status --short`.
* Clean up any debug/test/temp/scratch/log files created during AI work.
* Do not use `rm -rf`.
* Prefer `trash-put` instead of `rm`.
* Before deleting untracked files, run `git clean -nd`.
* Do not run `git clean -fd`, `git clean -fdx`, or `git reset --hard` unless the user explicitly confirms.
* Final responses must include a `Dọn dẹp` section.
