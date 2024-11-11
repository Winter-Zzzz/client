import { createSlice } from '@reduxjs/toolkit'

const initialState = [ // 일단 임의로 지정함
    { id: '1', type: 'refrigerator', nickname: 'nickname1' },
    { id: '2', type: 'tv', nickname: 'nickname2' },
    { id: '3', type: 'speaker', nickname: 'nickname3' },
]

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {

    }
})

export default deviceSlice.reducer