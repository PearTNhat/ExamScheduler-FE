import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isExpanded: false,
    isMobileOpen: false,
    isHovered: false,
    activeItem: null,
    openSubmenu: null
}

const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.isExpanded = !state.isExpanded
            // Reset submenu khi sidebar được thu nhỏ
            if (!state.isExpanded) {
                state.openSubmenu = null
            }
        },
        toggleMobileSidebar(state) {
            state.isMobileOpen = !state.isMobileOpen
            // Reset submenu khi mobile sidebar được đóng
            if (!state.isMobileOpen) {
                state.openSubmenu = null
            }
        },
        setIsHovered(state, action) {
            state.isHovered = action.payload
            // Reset submenu khi không hover và sidebar đang thu nhỏ
            if (!action.payload && !state.isExpanded && !state.isMobileOpen) {
                state.openSubmenu = null
            }
        },
        setActiveItem(state, action) {
            state.activeItem = action.payload
        },
        toggleSubmenu(state, action) {
            state.openSubmenu = state.openSubmenu === action.payload ? null : action.payload
        },
        resetSubmenu(state) {
            state.openSubmenu = null
        }
    }
})

export const sideBarReducer = sideBarSlice.reducer
export const sideBarActions = sideBarSlice.actions
