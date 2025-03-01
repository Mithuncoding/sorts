document.addEventListener("DOMContentLoaded", function() {
    const lanes = [];
    const laneElements = document.querySelectorAll('.lane');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const speedRange = document.getElementById('speedRange');
    const speedValue = document.getElementById('speedValue');
    const arraySizeInput = document.getElementById('arraySize');
    const arraySizeValue = document.getElementById('arraySizeValue');
    const distributionType = document.getElementById('distributionType');
    const audioToggle = document.getElementById('audioToggle');
    const themeToggle = document.querySelector('.theme-toggle');
    const resultsModal = document.getElementById('results-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    let isPaused = false;
    let isSorting = false;
    let firstPlaceAwarded = false;
    let soundsEnabled = false;
    let darkMode = false;
  
    const soundEffects = {
      compare: new Audio('data:audio/wav;base64,UklGRiQDAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQADAACBhYqFbF1fdJKrGhMxNjEbEgogHxEQGRwkJCIdFQwaICstNjQ5MzcyKyAXDBUbIiUpJiIdFhUXGBUUExERERQWGh0cGxsZFBEUDQwPCQUJBwQBAAIFCAkJCwsPEhYaHR8iIiQkJSYoKSssLi0vMzc2ODs7PDo6ODc2NDAvLCknIyAeGhcVEQ0LCgcFAwMCAgEBAQMEBQcICgsMDQ8QEBESExMTFBQUFRYWFhcYGBgZGhsbHB0eHh8gISIjIyQlJiYnKCkqKissLC0uLzAwMTIzNDU2Nzg5Ojo7PDw9Pj9AQUFDQ0RFRkdISUpLS0xNTk9QUVJTV1tcXV5fYGFiY2RlZmhpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAAAAAACAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWG'),
      swap: new Audio('data:audio/wav;base64,UklGRlQDAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YTADAAB9goiCal1fdZOsKBwyOjUeFAwgHhEPFxkiIiEcFQ0ZHiszPEJHSUlGQjw1LS0uMDM2ODY0MS0pJSAaFRIPCwgGBQMCAQECAwUIDA8TFhkdICMlJicoKCkpKiorKywuLzAxMzQ2Nzk6Ozw9Pj9AQUFDQ0RFRkdISUpLS0xNTk9QUVJTV1tcXV5fYGFiY2RlZmhpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAAAAAACAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
      complete: new Audio('data:audio/wav;base64,UklGRrQDAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YZQDAAB5foR/ZltedJStNiI5QT0lGhEhHhIPFRgeHx4YFBEYL0BLVl5iZmhqamloZWJgXltYVVNPSURAPDcyLisnIh0ZFREOCwkHBQQDAgIBAgMEBQcJCw0PEhQWGRsdHyEjJSYoKSssLS4wMTM0NTc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTV1tcXV5fYGFiY2RlZmhpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAAAAAACAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALnTLcw==')
    };
  
    const colors = {
      barDefault: '#4a6fff',
      barCompare: '#ff6b6b',
      barSwap: '#e74c3c',
      barSorted: '#2ecc71'
    };
  
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      darkMode = !darkMode;
      const icon = themeToggle.querySelector('i');
      if (darkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  
    audioToggle.addEventListener('change', function() {
      soundsEnabled = audioToggle.checked;
    });
  
    speedRange.addEventListener('input', function() {
      speedValue.textContent = speedRange.value;
    });
  
    arraySizeInput.addEventListener('input', function() {
      arraySizeValue.textContent = arraySizeInput.value;
    });
  
    laneElements.forEach(laneEl => {
      const canvas = laneEl.querySelector('canvas');
      canvas.width = 380;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      const status = laneEl.querySelector('.status');
      const swapsElement = laneEl.querySelector('.swaps');
      const comparisonsElement = laneEl.querySelector('.comparisons');
      const timeElement = laneEl.querySelector('.time');
      const algoName = laneEl.dataset.algo;
      
      lanes.push({
        element: laneEl,
        canvas: canvas,
        ctx: ctx,
        status: status,
        swapsElement: swapsElement,
        comparisonsElement: comparisonsElement,
        timeElement: timeElement,
        algoName: algoName,
        algorithm: null,
        array: [],
        generator: null,
        highlightIndices: [],
        sortedIndices: [],
        finished: false,
        timer: null,
        startTime: null,
        finishTime: null,
        elapsedTime: 0,
        comparisons: 0,
        swaps: 0,
        overwrites: 0
      });
    });
  
    startButton.addEventListener('click', function() {
      if (isSorting && isPaused) {
        resumeRace();
      } else {
        startRace();
      }
    });
  
    pauseButton.addEventListener('click', function() {
      if (!isPaused) {
        pauseRace();
      } else {
        resumeRace();
      }
    });
  
    resetButton.addEventListener('click', function() {
      resetRace();
    });
  
    closeBtn.addEventListener('click', function() {
      resultsModal.style.display = 'none';
    });
  
    window.addEventListener('click', function(event) {
      if (event.target == resultsModal) {
        resultsModal.style.display = 'none';
      }
    });
  
    function startRace() {
      resetRace(false);
      isSorting = true;
      isPaused = false;
      firstPlaceAwarded = false;
      startButton.disabled = true;
      pauseButton.disabled = false;
      pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
      resetButton.disabled = false;
      
      const size = parseInt(arraySizeInput.value);
      const distribution = distributionType.value;
      const baseArray = generateArray(size, distribution);
      
      clearStatsDisplay();
      updateStatsDisplay(true);
  
      lanes.forEach(lane => {
        lane.array = [...baseArray];
        lane.finished = false;
        lane.highlightIndices = [];
        lane.sortedIndices = [];
        lane.comparisons = 0;
        lane.swaps = 0;
        lane.overwrites = 0;
        lane.elapsedTime = 0;
        lane.startTime = performance.now();
        lane.swapsElement.textContent = '0';
        lane.comparisonsElement.textContent = '0';
        lane.timeElement.textContent = '0.00s';
        lane.status.textContent = "Running...";
        lane.element.classList.add('active');
        lane.element.classList.remove('finished', 'first-place');
        
        lane.algorithm = getAlgorithm(lane.algoName);
        lane.generator = lane.algorithm(lane.array);
        
        drawLane(lane);
        processLaneStep(lane);
      });
    }
  
    function pauseRace() {
      isPaused = true;
      pauseButton.innerHTML = '<i class="fas fa-play"></i> Resume';
      startButton.disabled = false;
      
      lanes.forEach(lane => {
        if (!lane.finished && lane.timer) {
          clearTimeout(lane.timer);
          lane.timer = null;
          lane.elapsedTime += performance.now() - lane.startTime;
        }
      });
    }
  
    function resumeRace() {
      isPaused = false;
      pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
      startButton.disabled = true;
      
      const currentTime = performance.now();
      
      lanes.forEach(lane => {
        if (!lane.finished) {
          lane.startTime = currentTime;
          processLaneStep(lane);
        }
      });
    }
  
    function resetRace(resetUI = true) {
      lanes.forEach(lane => {
        if (lane.timer) {
          clearTimeout(lane.timer);
          lane.timer = null;
        }
        lane.finished = true;
        lane.highlightIndices = [];
        lane.sortedIndices = [];
        lane.status.textContent = "";
        lane.swapsElement.textContent = "0";
        lane.comparisonsElement.textContent = "0";
        lane.timeElement.textContent = "0.00s";
        lane.element.classList.remove('active', 'finished', 'first-place');
        lane.ctx.clearRect(0, 0, lane.canvas.width, lane.canvas.height);
      });
      
      if (resetUI) {
        startButton.disabled = false;
        pauseButton.disabled = true;
        pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
        resetButton.disabled = false;
        clearStatsDisplay();
      }
      
      isSorting = false;
      isPaused = false;
    }
  
    function generateArray(size, distribution = 'random') {
      const arr = [];
      const maxVal = 180; // Maximum bar height
      
      switch (distribution) {
        case 'random':
          for (let i = 0; i < size; i++) {
            arr.push(Math.floor(Math.random() * (maxVal - 10)) + 10);
          }
          break;
          
        case 'nearlySorted':
          for (let i = 0; i < size; i++) {
            arr.push(Math.floor((i / size) * maxVal) + 10);
          }
          
          for (let i = 0; i < size * 0.1; i++) {
            const idx1 = Math.floor(Math.random() * size);
            const idx2 = Math.floor(Math.random() * size);
            [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
          }
          break;
          
        case 'reversed':
          for (let i = 0; i < size; i++) {
            arr.push(Math.floor(((size - i) / size) * maxVal) + 10);
          }
          break;
          
        case 'fewUnique':
          const uniqueValues = [10, 50, 90, 130, 170];
          for (let i = 0; i < size; i++) {
            arr.push(uniqueValues[Math.floor(Math.random() * uniqueValues.length)]);
          }
          break;
      }
      
      return arr;
    }
  
    function processLaneStep(lane) {
      if (lane.finished || isPaused) return;
      
      try {
        const result = lane.generator.next();
        
        if (result.done) {
          finishLane(lane);
          return;
        }
        
        const step = result.value;
        
        if (step.type === 'compare') {
          lane.comparisons++;
          lane.highlightIndices = step.indices || [];
          lane.comparisonsElement.textContent = lane.comparisons;
          
          if (soundsEnabled) {
            soundEffects.compare.currentTime = 0;
            soundEffects.compare.play();
          }
        } else if (step.type === 'swap') {
          lane.swaps++;
          lane.highlightIndices = step.indices || [];
          lane.swapsElement.textContent = lane.swaps;
          
          if (soundsEnabled) {
            soundEffects.swap.currentTime = 0;
            soundEffects.swap.play();
          }
        } else if (step.type === 'overwrite') {
          lane.overwrites++;
          lane.highlightIndices = step.indices || [];
        } else if (step.type === 'mark-sorted') {
          lane.sortedIndices = lane.sortedIndices.concat(step.indices || []);
        }
        
        lane.status.textContent = capitalizeFirstLetter(step.type);
        lane.timeElement.textContent = ((performance.now() - lane.startTime + lane.elapsedTime) / 1000).toFixed(2) + 's';
        
        drawLane(lane);
        
        const delay = 101 - parseInt(speedRange.value);
        lane.timer = setTimeout(() => processLaneStep(lane), delay);
      } catch (error) {
        console.error("Error in algorithm:", error);
        lane.status.textContent = "Error!";
        lane.finished = true;
      }
    }
  
    function finishLane(lane) {
      lane.finished = true;
      lane.finishTime = performance.now();
      lane.highlightIndices = [];
      lane.sortedIndices = Array.from({ length: lane.array.length }, (_, i) => i);
      
      drawLane(lane);
      
      const time = (lane.finishTime - lane.startTime + lane.elapsedTime) / 1000;
      lane.timeElement.textContent = time.toFixed(2) + 's';
      lane.status.textContent = "Finished!";
      lane.element.classList.remove('active');
      lane.element.classList.add('finished');
      
      if (!firstPlaceAwarded) {
        lane.element.classList.add('first-place');
        firstPlaceAwarded = true;
        
        if (soundsEnabled) {
          soundEffects.complete.currentTime = 0;
          soundEffects.complete.play();
        }
      }
      
      updateStatsDisplay();
      
      if (lanes.every(l => l.finished)) {
        showResults();
        startButton.disabled = false;
        pauseButton.disabled = true;
      }
    }
  
    function drawLane(lane) {
      const ctx = lane.ctx;
      const canvas = lane.canvas;
      const array = lane.array;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = Math.max(1, (canvas.width / array.length) - 1);
      const spacing = (canvas.width - (barWidth * array.length)) / (array.length + 1);
      
      for (let i = 0; i < array.length; i++) {
        const barHeight = array[i];
        const x = i * (barWidth + spacing) + spacing;
        const y = canvas.height - barHeight;
        
        if (lane.sortedIndices.includes(i)) {
          ctx.fillStyle = colors.barSorted;
        } else if (lane.highlightIndices.includes(i)) {
          ctx.fillStyle = lane.highlightIndices.length === 2 && lane.highlightIndices[0] === i && 
                           lane.highlightIndices[1] === i + 1 ? colors.barCompare : colors.barSwap;
        } else {
          ctx.fillStyle = colors.barDefault;
        }
        
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }
  
    function updateStatsDisplay(initial = false) {
      const statsContainer = document.getElementById('stats-container');
      
      if (initial) {
        statsContainer.innerHTML = '';
        return;
      }
      
      const finishedLanes = lanes.filter(l => l.finished);
      if (finishedLanes.length === 0) return;
      
      const sortedLanes = [...finishedLanes].sort((a, b) => {
        return (a.finishTime - a.startTime + a.elapsedTime) - (b.finishTime - b.startTime + b.elapsedTime);
      });
      
      const fastestTime = (sortedLanes[0].finishTime - sortedLanes[0].startTime + sortedLanes[0].elapsedTime) / 1000;
      const fastestAlgo = sortedLanes[0].algoName;
      
      const mostEfficientLane = [...finishedLanes].sort((a, b) => a.comparisons - b.comparisons)[0];
      const leastSwapsLane = [...finishedLanes].sort((a, b) => a.swaps - b.swaps)[0];
      
      statsContainer.innerHTML = `
        <div class="stats-card fade-in">
          <div class="stats-card-heading">Fastest Algorithm</div>
          <div class="stats-value">${fastestAlgo}</div>
          <div class="stats-label">${fastestTime.toFixed(2)}s</div>
        </div>
        <div class="stats-card fade-in">
          <div class="stats-card-heading">Most Efficient</div>
          <div class="stats-value">${mostEfficientLane.algoName}</div>
          <div class="stats-label">${mostEfficientLane.comparisons} comparisons</div>
        </div>
        <div class="stats-card fade-in">
          <div class="stats-card-heading">Least Swaps</div>
          <div class="stats-value">${leastSwapsLane.algoName}</div>
          <div class="stats-label">${leastSwapsLane.swaps} swaps</div>
        </div>
      `;
    }
  
    function clearStatsDisplay() {
      const statsContainer = document.getElementById('stats-container');
      statsContainer.innerHTML = `
        <div class="stats-card waiting">
          <span>Run the visualization to see statistics</span>
        </div>
      `;
    }
  
    function showResults() {
      const detailedResults = document.getElementById('detailed-results');
      const resultsChart = document.getElementById('results-chart');
      
      const sortedLanes = [...lanes].sort((a, b) => {
        if (!a.finished) return 1;
        if (!b.finished) return -1;
        return (a.finishTime - a.startTime + a.elapsedTime) - (b.finishTime - b.startTime + b.elapsedTime);
      });
      
      detailedResults.innerHTML = '';
      sortedLanes.forEach((lane, index) => {
        if (!lane.finished) return;
        
        const time = (lane.finishTime - lane.startTime + lane.elapsedTime) / 1000;
        
        detailedResults.innerHTML += `
          <div class="result-card slide-in" style="animation-delay: ${index * 0.1}s">
            <h3><span class="position">${index + 1}</span> ${lane.algoName}</h3>
            <div class="result-stat">
              <span class="label">Time:</span>
              <span>${time.toFixed(2)}s</span>
            </div>
            <div class="result-stat">
              <span class="label">Comparisons:</span>
              <span>${lane.comparisons}</span>
            </div>
            <div class="result-stat">
              <span class="label">Swaps:</span>
              <span>${lane.swaps}</span>
            </div>
            ${lane.overwrites ? `
            <div class="result-stat">
              <span class="label">Overwrites:</span>
              <span>${lane.overwrites}</span>
            </div>` : ''}
          </div>
        `;
      });
      
      if (window.Chart && resultsChart) {
        const chartLabels = sortedLanes.filter(l => l.finished).map(l => l.algoName);
        const chartData = sortedLanes.filter(l => l.finished).map(l => (l.finishTime - l.startTime + l.elapsedTime) / 1000);
        const chartColors = sortedLanes.filter(l => l.finished).map((_, i) => {
          const hue = (i * 360 / chartLabels.length) % 360;
          return `hsl(${hue}, 70%, 60%)`;
        });
        
        if (window.resultsChartInstance) {
          window.resultsChartInstance.destroy();
        }
        
        window.resultsChartInstance = new Chart(resultsChart, {
          type: 'bar',
          data: {
            labels: chartLabels,
            datasets: [{
              label: 'Time (seconds)',
              data: chartData,
              backgroundColor: chartColors,
              borderColor: chartColors.map(c => c.replace('60%', '50%')),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Time (seconds)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Algorithm'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  afterLabel: function(context) {
                    const index = context.dataIndex;
                    const lane = sortedLanes.filter(l => l.finished)[index];
                    return [
                      `Comparisons: ${lane.comparisons}`,
                      `Swaps: ${lane.swaps}`
                    ];
                  }
                }
              }
            }
          }
        });
      }
      
      resultsModal.style.display = 'block';
    }
  
    // Utility Functions
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    // Sorting Algorithms
    function getAlgorithm(name) {
      const algorithms = {
        "Bubble Sort": bubbleSort,
        "Selection Sort": selectionSort,
        "Insertion Sort": insertionSort,
        "Quick Sort": quickSort,
        "Merge Sort": mergeSort,
        "Heap Sort": heapSort,
        "Shell Sort": shellSort,
        "Radix Sort": radixSort,
        "Cocktail Sort": cocktailSort,
        "Tim Sort": timSort
      };
      
      return algorithms[name];
    }
  
    // Bubble Sort
    function* bubbleSort(arr) {
      let n = arr.length;
      let swapped;
      
      for (let i = 0; i < n; i++) {
        swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
          yield { type: 'compare', indices: [j, j + 1] };
          
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapped = true;
            yield { type: 'swap', indices: [j, j + 1] };
          }
        }
        
        yield { type: 'mark-sorted', indices: [n - i - 1] };
        
        if (!swapped) {
          for (let k = 0; k < n - i - 1; k++) {
            yield { type: 'mark-sorted', indices: [k] };
          }
          break;
        }
      }
      
      return arr;
    }
  
    // Selection Sort
    function* selectionSort(arr) {
      const n = arr.length;
      
      for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < n; j++) {
          yield { type: 'compare', indices: [minIndex, j] };
          if (arr[j] < arr[minIndex]) {
            minIndex = j;
          }
        }
        
        if (minIndex !== i) {
          [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
          yield { type: 'swap', indices: [i, minIndex] };
        }
        
        yield { type: 'mark-sorted', indices: [i] };
      }
      
      yield { type: 'mark-sorted', indices: [n - 1] };
      return arr;
    }
  
    // Insertion Sort
    function* insertionSort(arr) {
      const n = arr.length;
      
      yield { type: 'mark-sorted', indices: [0] };
      
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        
        yield { type: 'compare', indices: [j, i] };
        
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          yield { type: 'swap', indices: [j, j + 1] };
          j--;
          
          if (j >= 0) {
            yield { type: 'compare', indices: [j, i] };
          }
        }
        
        arr[j + 1] = key;
        
        if (j + 1 !== i) {
          yield { type: 'swap', indices: [j + 1, i] };
        }
        
        for (let k = 0; k <= i; k++) {
          yield { type: 'mark-sorted', indices: [k] };
        }
      }
      
      return arr;
    }
  
    // Quick Sort
    function* quickSort(arr) {
      const stack = [[0, arr.length - 1]];
      const sortedIndices = new Set();
      
      while (stack.length > 0) {
        const [start, end] = stack.pop();
        
        if (start >= end) {
          if (!sortedIndices.has(start)) {
            sortedIndices.add(start);
            yield { type: 'mark-sorted', indices: [start] };
          }
          continue;
        }
        
        const pivotIndex = yield* partition(arr, start, end, sortedIndices);
        
        sortedIndices.add(pivotIndex);
        yield { type: 'mark-sorted', indices: [pivotIndex] };
        
        if (pivotIndex - 1 > start) {
          stack.push([start, pivotIndex - 1]);
        } else {
          for (let i = start; i < pivotIndex; i++) {
            if (!sortedIndices.has(i)) {
              sortedIndices.add(i);
              yield { type: 'mark-sorted', indices: [i] };
            }
          }
        }
        
        if (pivotIndex + 1 < end) {
          stack.push([pivotIndex + 1, end]);
        } else {
          for (let i = pivotIndex + 1; i <= end; i++) {
            if (!sortedIndices.has(i)) {
              sortedIndices.add(i);
              yield { type: 'mark-sorted', indices: [i] };
            }
          }
        }
      }
      
      return arr;
    }
  
    function* partition(arr, start, end, sortedIndices) {
      const pivot = arr[end];
      let pivotIndex = start;
      
      yield { type: 'compare', indices: [pivotIndex, end] };
      
      for (let i = start; i < end; i++) {
        yield { type: 'compare', indices: [i, end] };
        
        if (arr[i] < pivot) {
          if (i !== pivotIndex) {
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            yield { type: 'swap', indices: [i, pivotIndex] };
          }
          pivotIndex++;
        }
      }
      
      [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
      yield { type: 'swap', indices: [pivotIndex, end] };
      
      return pivotIndex;
    }
  
    // Merge Sort
    function* mergeSort(arr) {
      const n = arr.length;
      const sortedIndices = new Set();
      
      for (let size = 1; size < n; size *= 2) {
        for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
          const mid = Math.min(leftStart + size, n);
          const rightEnd = Math.min(leftStart + 2 * size, n);
          
          yield* merge(arr, leftStart, mid, rightEnd, sortedIndices);
          
          if (size * 2 >= n) {
            for (let i = leftStart; i < rightEnd; i++) {
              if (!sortedIndices.has(i)) {
                sortedIndices.add(i);
                yield { type: 'mark-sorted', indices: [i] };
              }
            }
          }
        }
      }
      
      return arr;
    }
  
    function* merge(arr, start, mid, end, sortedIndices) {
      const left = arr.slice(start, mid);
      const right = arr.slice(mid, end);
      
      let i = 0, j = 0, k = start;
      
      while (i < left.length && j < right.length) {
        yield { type: 'compare', indices: [start + i, mid + j] };
        
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }
        
        yield { type: 'overwrite', indices: [k] };
        k++;
      }
      
      while (i < left.length) {
        arr[k] = left[i];
        yield { type: 'overwrite', indices: [k] };
        i++;
        k++;
      }
      
      while (j < right.length) {
        arr[k] = right[j];
        yield { type: 'overwrite', indices: [k] };
        j++;
        k++;
      }
      
      return arr;
    }
  
    // Heap Sort
    function* heapSort(arr) {
      const n = arr.length;
      
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(arr, n, i);
      }
      
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield { type: 'swap', indices: [0, i] };
        yield { type: 'mark-sorted', indices: [i] };
        
        yield* heapify(arr, i, 0);
      }
      
      yield { type: 'mark-sorted', indices: [0] };
      return arr;
    }
  
    function* heapify(arr, n, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n) {
        yield { type: 'compare', indices: [left, largest] };
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }
      
      if (right < n) {
        yield { type: 'compare', indices: [right, largest] };
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }
      
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        yield { type: 'swap', indices: [i, largest] };
        yield* heapify(arr, n, largest);
      }
    }
  
    // Shell Sort
    function* shellSort(arr) {
      const n = arr.length;
      const sortedIndices = new Set();
      
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
          let temp = arr[i];
          let j;
          
          for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
            yield { type: 'compare', indices: [j, j - gap] };
            arr[j] = arr[j - gap];
            yield { type: 'swap', indices: [j, j - gap] };
          }
          
          if (j !== i) {
            arr[j] = temp;
            yield { type: 'swap', indices: [j, i] };
          }
        }
      }
      
      for (let i = 0; i < n; i++) {
        yield { type: 'mark-sorted', indices: [i] };
      }
      
      return arr;
    }
  
    // Radix Sort
    function* radixSort(arr) {
      const max = Math.max(...arr);
      const maxDigits = Math.floor(Math.log10(max)) + 1;
      const n = arr.length;
      const sortedIndices = new Set();
      
      for (let digit = 0; digit < maxDigits; digit++) {
        const buckets = Array.from({ length: 10 }, () => []);
        
        for (let i = 0; i < n; i++) {
          const value = arr[i];
          const digitValue = Math.floor(value / Math.pow(10, digit)) % 10;
          buckets[digitValue].push(value);
          yield { type: 'compare', indices: [i] };
        }
        
        let idx = 0;
        for (let bucket = 0; bucket < 10; bucket++) {
          for (let value of buckets[bucket]) {
            arr[idx] = value;
            yield { type: 'overwrite', indices: [idx] };
            idx++;
          }
        }
      }
      
      for (let i = 0; i < n; i++) {
        yield { type: 'mark-sorted', indices: [i] };
      }
      
      return arr;
    }
  
    // Cocktail Sort
    function* cocktailSort(arr) {
      let start = 0;
      let end = arr.length - 1;
      let swapped = true;
      
      while (swapped) {
        swapped = false;
        
        for (let i = start; i < end; i++) {
          yield { type: 'compare', indices: [i, i + 1] };
          if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            swapped = true;
            yield { type: 'swap', indices: [i, i + 1] };
          }
        }
        
        if (!swapped) break;
        swapped = false;
        
        yield { type: 'mark-sorted', indices: [end] };
        end--;
        
        for (let i = end; i >= start; i--) {
          yield { type: 'compare', indices: [i, i + 1] };
          if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            swapped = true;
            yield { type: 'swap', indices: [i, i + 1] };
          }
        }
        
        yield { type: 'mark-sorted', indices: [start] };
        start++;
      }
      
      for (let i = start; i <= end; i++) {
        yield { type: 'mark-sorted', indices: [i] };
      }
      
      return arr;
    }
  
    // Tim Sort
    function* timSort(arr) {
      const n = arr.length;
      const RUN = 32;
      const sortedIndices = new Set();
      
      // Sort individual subarrays of size RUN
      for (let i = 0; i < n; i += RUN) {
        yield* insertionSortSubarray(arr, i, Math.min(i + RUN - 1, n - 1), sortedIndices);
      }
      
      // Merge subarrays
      for (let size = RUN; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
          const mid = Math.min(n - 1, left + size - 1);
          const right = Math.min(n - 1, left + 2 * size - 1);
          
          if (mid < right) {
            yield* mergeTimSort(arr, left, mid, right, sortedIndices);
          }
        }
      }
      
      return arr;
    }
  
    function* insertionSortSubarray(arr, left, right, sortedIndices) {
      for (let i = left + 1; i <= right; i++) {
        let temp = arr[i];
        let j = i - 1;
        
        yield { type: 'compare', indices: [j, i] };
        
        while (j >= left && arr[j] > temp) {
          arr[j + 1] = arr[j];
          yield { type: 'swap', indices: [j, j + 1] };
          j--;
          
          if (j >= left) {
            yield { type: 'compare', indices: [j, i] };
          }
        }
        
        arr[j + 1] = temp;
        
        if (j + 1 !== i) {
          yield { type: 'swap', indices: [j + 1, i] };
        }
      }
      
      for (let i = left; i <= right; i++) {
        if (!sortedIndices.has(i)) {
          sortedIndices.add(i);
        }
      }
      
      return arr;
    }
  
    function* mergeTimSort(arr, left, mid, right, sortedIndices) {
      const len1 = mid - left + 1;
      const len2 = right - mid;
      
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;
      
      while (i < len1 && j < len2) {
        yield { type: 'compare', indices: [left + i, mid + 1 + j] };
        
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        
        yield { type: 'overwrite', indices: [k] };
        k++;
      }
      
      while (i < len1) {
        arr[k] = leftArr[i];
        yield { type: 'overwrite', indices: [k] };
        i++;
        k++;
      }
      
      while (j < len2) {
        arr[k] = rightArr[j];
        yield { type: 'overwrite', indices: [k] };
        j++;
        k++;
      }
      
      for (let idx = left; idx <= right; idx++) {
        if (!sortedIndices.has(idx)) {
          sortedIndices.add(idx);
          yield { type: 'mark-sorted', indices: [idx] };
        }
      }
      
      return arr;
    }
  });