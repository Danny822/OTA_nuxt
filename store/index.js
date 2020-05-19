export const state = () => ({
  alertMsg: null
})

export const mutations = {
  updateState: (state, [column = null, val = null]) => {
    if (column) state[column] = val
  }
}
