import users from "../data/users.js";

export function findUser(email, password) {
  console.log(email, password, users);
  const user = users.find(({email: userEmail, password: userPassword}) => userEmail === email && userPassword === password)
  return user
}
export function findUserOrFail(email, password) {
  console.log(email, password, users);
  const user = users.find(({email: userEmail, password: userPassword}) => userEmail === email && userPassword === password)
  if(!user) {
    throw new Error('User not found')
  }
  return user
}
