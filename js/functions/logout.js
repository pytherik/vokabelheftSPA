export const logout = () => {
  localStorage.clear();
  location.reload();
}