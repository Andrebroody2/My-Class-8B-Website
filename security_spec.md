# Security Specification — Portal Kelas 8B SMPN 18 Kota Bogor

## 1. Data Invariants
1. **Identity Integrity**: Every document created by an authenticated user must have its author/sender UID (`uid`, `authorId`, `senderId`, `updatedBy`) strictly equal to `request.auth.uid` and require `request.auth.token.email_verified == true`.
2. **Role & Privilege Escalation Guard**: Regular users creating their `/users/{userId}` document can only assign `role == 'siswa'` unless they are the bootstrapped Admin/Owner (`blackjacknet034@gmail.com` or existing `/admins/{uid}`).
3. **Strict Keys & Anti-Update-Gap**: All `create` and `update` operations validate exact key sets (`hasAll` + `hasOnly`) and enforce strict `.size()` limits on every string field.
4. **Temporal Integrity**: All `createdAt` and `updatedAt` timestamps must match `request.time`.
5. **Private Messaging Isolation**: `/directMessages/{dmId}` can only be read (`get`/`list`) by the `senderId`, `recipientId`, or an Admin (`isAdmin()`).

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection on UserProfile**: `{ uid: "u1", username: "andi", displayName: "Andi", role: "siswa", coins: 100, equippedBanner: "default", equippedTitle: "Siswa 8B", verifiedBy: "BUAIDA8B", createdAt: SERVER_TIME, updatedAt: SERVER_TIME, isSuperAdmin: true }` -> REJECTED by `hasOnly`.
2. **Self-Privilege Escalation on Registration**: `{ uid: "u2", username: "hacker", displayName: "Hacker", role: "owner", coins: 999999, ... }` by non-admin -> REJECTED by role gate.
3. **Unverified Email Write**: Authenticated user with `email_verified: false` writing to `/groupMessages` -> REJECTED by `isVerifiedUser()`.
4. **Spoofed Sender ID in GroupMessage**: `{ senderId: "other_uid", ... }` -> REJECTED by `data.senderId == request.auth.uid`.
5. **Oversized String DoS in Chat**: `text` with 5,000 characters -> REJECTED by `data.text.size() <= 1000`.
6. **ID Poisoning Attack**: Document ID containing spaces or special characters (`../admin`) -> REJECTED by `isValidId()`.
7. **Forged Client Timestamp**: `createdAt` set to past/future timestamp instead of `request.time` -> REJECTED by `incoming().createdAt == request.time`.
8. **Unauthorized DM Read**: User `u3` attempting to read a DirectMessage between `u1` and `u2` -> REJECTED by `resource.data.senderId == request.auth.uid || resource.data.recipientId == request.auth.uid`.
9. **Immutable Field Mutation**: Updating `uid` or `createdAt` on `/users/{userId}` -> REJECTED by `incoming().uid == existing().uid && incoming().createdAt == existing().createdAt`.
10. **Terminal Assignment Status Modification**: Updating an assignment after `existing().status == 'selesai'` by non-admin -> REJECTED by terminal state lock.
11. **Value Poisoning on Update**: Updating `coins` on `/users/{userId}` with a string `"infinite"` -> REJECTED by `isValidUserProfile(incoming())`.
12. **Unauthorized SystemConfig Modification**: Non-admin/non-teacher attempting to overwrite `/systemConfig/main` -> REJECTED by `isAdminOrTeacher()`.

## 3. Security Rules Validation Runner
Verified via ESLint `@firebase/eslint-plugin-security-rules` and unit test suite.
