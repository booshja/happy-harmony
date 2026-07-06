# TASK

Merge the following branches into the current branch:

{{BRANCHES}}

For each branch:

1. Run `git merge <branch> --no-edit`
2. If there are merge conflicts, resolve them intelligently by reading both sides and choosing the correct resolution
3. After resolving conflicts, run `npm run typecheck` and `npm run test` to verify everything works
4. If tests fail, fix the issues before proceeding to the next branch

After all branches are merged, make a single commit summarizing the merge.

# CLOSE ISSUES

For each branch that was merged, close its issue by substituting the issue's identifier for `<ID>` in the following command:

`curl -sS -X POST https://api.linear.app/graphql -H "Authorization: $LINEAR_API_KEY" -H "Content-Type: application/json" --data '{"query":"mutation { issueUpdate(id: \"<ID>\", input: { stateId: \"4e87981d-b4ee-41d0-9a39-4d8fd195789a\" }) { success issue { identifier state { name } } } }"}' | jq '.data.issueUpdate'`

Here are all the issues:

{{ISSUES}}

Once you've merged everything you can, output <promise>COMPLETE</promise>.
