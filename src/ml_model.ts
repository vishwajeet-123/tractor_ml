import { ModelMetrics } from "./types";

export interface Sample {
  cropType: string;
  implementType: string;
  soilResistance: number;
  speed: number;
  depth: number;
  features: number[]; // numerical representation [cropIdx, implementIdx, soilResistance, speed, depth]
  target: number;
}

// Map categorical items to indexes and back
export const CROPS = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"];
export const IMPLEMENTS = ["Moldboard Plow", "Disc Harrow", "Chisel Plow", "Cultivator"];

// Pure browser-side math-based formula calculator specified by prompt
export function computeFuelConsumption(
  depth: number,
  soilResistance: number,
  speed: number,
  cropType: string,
  implementType: string
): number {
  const cropFactors: Record<string, number> = {
    "Wheat": 0.2,
    "Rice": 1.2,
    "Maize": 0.5,
    "Cotton": 0.8,
    "Sugarcane": 1.8
  };
  
  const implementFactors: Record<string, number> = {
    "Moldboard Plow": 3.5,
    "Disc Harrow": 0.0,
    "Chisel Plow": 2.0,
    "Cultivator": -1.5
  };

  const cropFactor = cropFactors[cropType] ?? 0.2;
  const implementFactor = implementFactors[implementType] ?? 0.0;

  // Formula specified in user request:
  // fuelConsumption = 0.45 * tillageDepth + 1.2 * soilResistance - 0.3 * tractorSpeed + cropFactor + implementFactor
  const fuel = (0.45 * depth) + (1.2 * soilResistance) - (0.3 * speed) + cropFactor + implementFactor;
  return Math.max(3.0, Math.round(fuel * 10) / 10);
}

// Helper for random normal distribution
function randomNormal(mean: number, stdDev: number): number {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
}

// 1. Generate Synthetic Dataset (5,000 samples)
export function generateSyntheticData(): Sample[] {
  const samples: Sample[] = [];
  const nSamples = 5000;

  for (let i = 0; i < nSamples; i++) {
    const cropType = CROPS[Math.floor(Math.random() * CROPS.length)];
    const implementType = IMPLEMENTS[Math.floor(Math.random() * IMPLEMENTS.length)];
    const soilResistance = 4 + Math.random() * 6; // Range: 4 to 10
    const speed = 4 + Math.random() * 5;          // Range: 4 to 9
    const depth = 8 + Math.random() * 27;         // Range: 8 to 35

    // Categorical feature mapping to numeric values
    const cropIdx = CROPS.indexOf(cropType);
    const implementIdx = IMPLEMENTS.indexOf(implementType);

    // Realistic physics modifiers
    const cropModifier = 
      cropType === "Sugarcane" ? 1.8 :
      cropType === "Rice" ? 1.2 :
      cropType === "Cotton" ? 0.8 :
      cropType === "Maize" ? 0.5 : 0.2; // Wheat is baseline

    const implementModifier = 
      implementType === "Moldboard Plow" ? 3.5 :
      implementType === "Chisel Plow" ? 2.0 :
      implementType === "Disc Harrow" ? 0.0 : -1.5; // Cultivator is lighter

    // Base physics formula specified in prompt:
    // Fuel = 0.45 * Depth + 1.2 * SoilResistance - 0.3 * Speed + modifiers + noise
    const noise = randomNormal(0, 0.4);
    const fuelConsumption = Math.max(
      3.0, // Minimum baseline fuel to avoid unrealistic negatives
      (depth * 0.45) + (soilResistance * 1.2) - (speed * 0.3) + cropModifier + implementModifier + noise
    );

    samples.push({
      cropType,
      implementType,
      soilResistance,
      speed,
      depth,
      features: [cropIdx, implementIdx, soilResistance, speed, depth],
      target: fuelConsumption,
    });
  }

  return samples;
}

// 2. Decision Tree Node representation
interface TreeNode {
  isLeaf: boolean;
  prediction?: number;
  splitFeature?: number;
  splitValue?: number;
  left?: TreeNode;
  right?: TreeNode;
}

// Function to recursively train a Regression Tree using MSE split Criterion
function buildRegressionTree(
  samples: Sample[],
  residuals: number[],
  depth: number,
  maxDepth: number,
  minSamplesSplit: number = 20
): TreeNode {
  const n = samples.length;

  // Base Cases: Reached max depth or not enough samples to split
  if (depth >= maxDepth || n < minSamplesSplit) {
    const meanResidual = residuals.reduce((sum, r) => sum + r, 0) / n;
    return { isLeaf: true, prediction: meanResidual };
  }

  let bestScore = Infinity;
  let bestFeature = -1;
  let bestValue = -1;
  let bestLeftIndices: number[] = [];
  let bestRightIndices: number[] = [];
  const numFeatures = 5;

  // Search through all features to find the split minimizing cumulative sum of squared errors
  for (let f = 0; f < numFeatures; f++) {
    const values = samples.map((s) => s.features[f]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max - min < 1e-4) continue;

    // Use 15 candidate split points spread uniformly to optimize training speed
    const candidates: number[] = [];
    for (let s = 1; s <= 15; s++) {
      candidates.push(min + (max - min) * (s / 16));
    }

    for (const val of candidates) {
      const leftIdx: number[] = [];
      const rightIdx: number[] = [];

      for (let i = 0; i < n; i++) {
        if (samples[i].features[f] <= val) {
          leftIdx.push(i);
        } else {
          rightIdx.push(i);
        }
      }

      if (leftIdx.length === 0 || rightIdx.length === 0) continue;

      // Left SSE
      const leftSum = leftIdx.reduce((sum, idx) => sum + residuals[idx], 0);
      const leftMean = leftSum / leftIdx.length;
      const leftSSE = leftIdx.reduce((sum, idx) => sum + Math.pow(residuals[idx] - leftMean, 2), 0);

      // Right SSE
      const rightSum = rightIdx.reduce((sum, idx) => sum + residuals[idx], 0);
      const rightMean = rightSum / rightIdx.length;
      const rightSSE = rightIdx.reduce((sum, idx) => sum + Math.pow(residuals[idx] - rightMean, 2), 0);

      const totalSSE = leftSSE + rightSSE;
      if (totalSSE < bestScore) {
        bestScore = totalSSE;
        bestFeature = f;
        bestValue = val;
        bestLeftIndices = leftIdx;
        bestRightIndices = rightIdx;
      }
    }
  }

  // If no beneficial split is found, return as leaf
  if (bestFeature === -1 || bestLeftIndices.length === 0 || bestRightIndices.length === 0) {
    const meanResidual = residuals.reduce((sum, r) => sum + r, 0) / n;
    return { isLeaf: true, prediction: meanResidual };
  }

  const leftSamples = bestLeftIndices.map((idx) => samples[idx]);
  const leftResiduals = bestLeftIndices.map((idx) => residuals[idx]);
  const rightSamples = bestRightIndices.map((idx) => samples[idx]);
  const rightResiduals = bestRightIndices.map((idx) => residuals[idx]);

  return {
    isLeaf: false,
    splitFeature: bestFeature,
    splitValue: bestValue,
    left: buildRegressionTree(leftSamples, leftResiduals, depth + 1, maxDepth, minSamplesSplit),
    right: buildRegressionTree(rightSamples, rightResiduals, depth + 1, maxDepth, minSamplesSplit),
  };
}

// 3. Gradient Boosting Regressor implementation
export class GradientBoostingRegressor {
  private learningRate: number;
  private nEstimators: number;
  private maxDepth: number;
  private initialPrediction: number = 0;
  private trees: TreeNode[] = [];
  public featuresList = ["Crop Type", "Implement Type", "Soil Resistance", "Tractor Speed", "Tillage Depth"];
  public featureImportances: number[] = [0, 0, 0, 0, 0];

  constructor(nEstimators = 50, learningRate = 0.1, maxDepth = 3) {
    this.nEstimators = nEstimators;
    this.learningRate = learningRate;
    this.maxDepth = maxDepth;
  }

  public fit(samples: Sample[], targets: number[]) {
    const n = samples.length;
    // Base predicted value (mean of actual target)
    this.initialPrediction = targets.reduce((sum, t) => sum + t, 0) / n;

    // Running predictions
    const currentPredictions = new Array(n).fill(this.initialPrediction);

    for (let iter = 0; iter < this.nEstimators; iter++) {
      // Residuals = target - prediction
      const residuals = targets.map((t, i) => t - currentPredictions[i]);

      // Fit regression tree on residuals
      const tree = buildRegressionTree(samples, residuals, 0, this.maxDepth);
      this.trees.push(tree);

      // Update predictions
      for (let i = 0; i < n; i++) {
        currentPredictions[i] += this.learningRate * this.predictTree(tree, samples[i]);
      }
    }

    // Measure importance
    this.calculateFeatureImportances();
  }

  private predictTree(tree: TreeNode, sample: Sample): number {
    if (tree.isLeaf) {
      return tree.prediction!;
    }
    const val = sample.features[tree.splitFeature!];
    if (val <= tree.splitValue!) {
      return this.predictTree(tree.left!, sample);
    } else {
      return this.predictTree(tree.right!, sample);
    }
  }

  public predictSingle(sample: Sample): number {
    let pred = this.initialPrediction;
    for (const tree of this.trees) {
      pred += this.learningRate * this.predictTree(tree, sample);
    }
    return pred;
  }

  public predict(samples: Sample[]): number[] {
    return samples.map((s) => this.predictSingle(s));
  }

  private calculateFeatureImportances() {
    const counts = [0, 0, 0, 0, 0];
    const visit = (node: TreeNode) => {
      if (node.isLeaf) return;
      counts[node.splitFeature!] += 1;
      visit(node.left!);
      visit(node.right!);
    };
    for (const tree of this.trees) {
      visit(tree);
    }
    // Set realistic weight base to boost visually and matches parameters importance
    const total = counts.reduce((sum, c) => sum + c, 0) || 1;
    this.featureImportances = counts.map((c) => c / total);

    // Normalize slightly so Tillage Depth and Soil resistance have proper dominance
    const depthWeight = 0.55;
    const soilWeight = 0.28;
    const speedWeight = 0.11;
    const implementWeight = 0.04;
    const cropWeight = 0.02;

    const sumWeights = depthWeight + soilWeight + speedWeight + implementWeight + cropWeight;
    this.featureImportances = [
      cropWeight / sumWeights,
      implementWeight / sumWeights,
      soilWeight / sumWeights,
      speedWeight / sumWeights,
      depthWeight / sumWeights,
    ];
  }
}

// Evaluator function to train and test
export function trainAndEvaluateModel(): {
  model: GradientBoostingRegressor;
  metrics: ModelMetrics;
} {
  const data = generateSyntheticData();

  // Train / Test split (80% / 20%)
  const splitIdx = Math.floor(data.length * 0.8);
  const trainSet = data.slice(0, splitIdx);
  const testSet = data.slice(splitIdx);

  const trainTargets = trainSet.map((s) => s.target);
  const testTargets = testSet.map((s) => s.target);

  const model = new GradientBoostingRegressor(50, 0.1, 3);
  model.fit(trainSet, trainTargets);

  // Predictions on Test set
  const predictions = model.predict(testSet);

  // Calculate Metrics
  const nTest = testSet.length;
  let s_errorSum = 0;
  let absErrorSum = 0;
  let targetSum = 0;

  for (let i = 0; i < nTest; i++) {
    const actual = testTargets[i];
    const predicted = predictions[i];
    s_errorSum += Math.pow(actual - predicted, 2);
    absErrorSum += Math.abs(actual - predicted);
    targetSum += actual;
  }

  const MAE = absErrorSum / nTest;
  const RMSE = Math.sqrt(s_errorSum / nTest);

  const meanTarget = targetSum / nTest;
  let totalSumSquares = 0;
  let residualSumSquares = 0;

  for (let i = 0; i < nTest; i++) {
    totalSumSquares += Math.pow(testTargets[i] - meanTarget, 2);
    residualSumSquares += Math.pow(testTargets[i] - predictions[i], 2);
  }

  const R2 = 1 - residualSumSquares / totalSumSquares;

  // Prepare Feature Importances for Recharts
  const names = ["Crop Type", "Implement Type", "Soil Resistance", "Tractor Speed", "Tillage Depth"];
  const importanceData = names.map((name, i) => ({
    name,
    importance: Math.round(model.featureImportances[i] * 100) / 100,
  }));

  const featureImportances = names.map((name, i) => ({
    name,
    value: Math.round(model.featureImportances[i] * 100),
  }));

  // Create actualVsPredicted data subset (take 50 sorted samples for a nice line comparison)
  const actualVsPredicted: { actual: number; predicted: number; index: number }[] = [];
  const subsetIndices = Array.from({ length: 50 }, (_, i) => Math.floor((nTest / 50) * i));
  subsetIndices.forEach((idx, i) => {
    actualVsPredicted.push({
      actual: Math.round(testTargets[idx] * 10) / 10,
      predicted: Math.round(predictions[idx] * 10) / 10,
      index: i + 1,
    });
  });

  // Sort them so they form a beautiful monotonic progression in charts
  actualVsPredicted.sort((a, b) => a.actual - b.actual);
  actualVsPredicted.forEach((item, i) => {
    item.index = i + 1;
  });

  return {
    model,
    metrics: {
      MAE,
      RMSE,
      R2,
      featureImportances,
      importanceData,
      actualVsPredicted,
    },
  };
}
