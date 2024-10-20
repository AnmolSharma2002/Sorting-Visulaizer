// Function to generate a random array of specified size
function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1); // Values between 1 and 100
}

// Function to visualize the array as bars
function visualizeArray(array, currentIndex = -1, sortedIndices = []) {
    const container = document.getElementById('array-container');
    container.innerHTML = ''; // Clear previous visualizations

    array.forEach((num, index) => {
        const bar = document.createElement('div');
        bar.style.height = `${num * 3}px`; // Scale the height for visibility
        bar.style.width = '30px'; // Set a fixed width for the bars
        
        // Set bar color based on sorting state
        if (sortedIndices.includes(index)) {
            bar.style.backgroundColor = 'green'; // Sorted bars remain green
        } else if (index === currentIndex) {
            bar.style.backgroundColor = 'red'; // Currently sorting bar
        } else {
            bar.style.backgroundColor = 'lightblue'; // Default color for unsorted bars
        }

        bar.style.margin = '2px'; // Add some space between bars
        bar.style.display = 'inline-block'; // Display bars inline
        bar.style.transition = 'height 0.5s'; // Add a transition effect
        container.appendChild(bar);
    });
}

// Bubble sort function with visualization
async function bubbleSort(array) {
    const n = array.length;
    const sortedIndices = new Set(); // Use a Set to keep track of sorted indices

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            visualizeArray(array, j, Array.from(sortedIndices)); // Visualize the current state before the swap
            
            // Pause to visualize the sorting process
            await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 0.1 seconds

            // Compare and swap if necessary
            if (array[j] > array[j + 1]) {
                // Swap elements
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }

        // Mark the last sorted element
        sortedIndices.add(n - i - 1); // Add the last sorted index to the set
        visualizeArray(array, -1, Array.from(sortedIndices)); // Visualize the current state after each outer loop
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for visibility
    }
    
    // Visualize the final sorted array
    visualizeArray(array, -1, Array.from(sortedIndices)); // Show final sorted array
}

// Selection sort function with visualization
async function selectionSort(array) {
    const n = array.length;
    const sortedIndices = new Set();
    
    for (let i = 0; i < n - 1; i++) {
        let min_index = i;
        
        for (let j = i + 1; j < n; j++) {
            visualizeArray(array, j, Array.from(sortedIndices));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (array[j] < array[min_index]) {
                min_index = j;
            }
        }
        
        // Swap the found minimum element with the first element
        if (min_index !== i) {
            [array[i], array[min_index]] = [array[min_index], array[i]];
        }
        
        sortedIndices.add(i);
        visualizeArray(array, -1, Array.from(sortedIndices));
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    sortedIndices.add(n - 1);
    visualizeArray(array, -1, Array.from(sortedIndices));
}

// Quick sort function with visualization
async function quickSort(array, low = 0, high = array.length - 1, sortedIndices = new Set()) {
    if (low < high) {
        const pivotIndex = await partition(array, low, high, sortedIndices);
        await quickSort(array, low, pivotIndex - 1, sortedIndices);
        await quickSort(array, pivotIndex + 1, high, sortedIndices);
    } else if (low >= 0 && low < array.length) {
        sortedIndices.add(low);
        visualizeArray(array, -1, Array.from(sortedIndices));
    }
}

async function partition(array, low, high, sortedIndices) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        visualizeArray(array, j, Array.from(sortedIndices));
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for visualization
        
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]]; // Swap pivot to correct position
    visualizeArray(array, i + 1, Array.from(sortedIndices));
    await new Promise(resolve => setTimeout(resolve, 100)); // Delay for visualization
    return i + 1; // Return the pivot index
}

// Merge sort function with visualization
async function mergeSort(array) {
    if (array.length <= 1) return array; // Base case

    const mid = Math.floor(array.length / 2); // Find the middle point
    const left = array.slice(0, mid); // Left half
    const right = array.slice(mid); // Right half

    // Recursively sort both halves
    const sortedLeft = await mergeSort(left);
    const sortedRight = await mergeSort(right);

    // Merge the sorted halves
    const sortedArray = await merge(sortedLeft, sortedRight);
    
    // Visualize the current state after merging
    visualizeArray(sortedArray); // Update visualization
    await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
    return sortedArray;
}

// Merge function to combine two sorted arrays
async function merge(left, right) {
    const merged = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        visualizeArray([...left, ...right], -1, []); // Visualize the current state
        await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
        if (left[i] < right[j]) {
            merged.push(left[i]);
            i++;
        } else {
            merged.push(right[j]);
            j++;
        }
    }

    // Concatenate any remaining elements
    while (i < left.length) {
        merged.push(left[i]);
        i++;
    }
    while (j < right.length) {
        merged.push(right[j]);
        j++;
    }

    return merged;
}

// Event listener for the Merge Sort button
document.getElementById('mergeSortBtn').addEventListener('click', async () => {
    const bars = document.querySelectorAll('#array-container div');
    const array = Array.from(bars).map(bar => parseInt(bar.style.height) / 3); // Get the current array values
    const sortedArray = await mergeSort(array); // Sort the array and visualize the process
    visualizeArray(sortedArray); // Visualize the final sorted array
});

// Event listener for the generate array button
document.getElementById('generateArrayBtn').addEventListener('click', () => {
    const arraySize = parseInt(document.getElementById('arraySize').value); // Get the size from input
    const randomArray = generateRandomArray(arraySize); // Generate the random array
    visualizeArray(randomArray); // Visualize the generated array
});

// Reset button functionality
document.getElementById('resetBtn').addEventListener('click', () => {
    const arraySize = parseInt(document.getElementById('arraySize').value); // Get the size from input
    const resetArray = generateRandomArray(arraySize); // Generate a new random array
    visualizeArray(resetArray); // Visualize the reset array
});

// Event listener for the Bubble Sort button
document.getElementById('bubbleSortBtn').addEventListener('click', async () => {
    const bars = document.querySelectorAll('#array-container div');
    const array = Array.from(bars).map(bar => parseInt(bar.style.height) / 3); // Get the current array values
    await bubbleSort(array); // Sort the array and visualize the process
});

// Event listener for the Selection Sort button
document.getElementById('selectionSortBtn').addEventListener('click', async () => {
    const bars = document.querySelectorAll('#array-container div');
    const array = Array.from(bars).map(bar => parseInt(bar.style.height) / 3); // Get the current array values
    await selectionSort(array); // Sort the array and visualize the process
});

// Event listener for the Quick Sort button
document.getElementById('quickSortBtn').addEventListener('click', async () => {
    const bars = document.querySelectorAll('#array-container div');
    const array = Array.from(bars).map(bar => parseInt(bar.style.height) / 3); // Get the current array values
    await quickSort(array); // Sort the array and visualize the process
});
