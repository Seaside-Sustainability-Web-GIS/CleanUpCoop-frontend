import {create} from 'zustand';

const useStore = create(() => ({
    isDataLoaded: false,
}));

export default useStore;
