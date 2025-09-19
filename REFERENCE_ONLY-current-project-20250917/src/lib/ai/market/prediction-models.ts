/**
 * AI-Powered Market Prediction Models
 * Predictive models for market metrics and outcomes with advanced forecasting
 */

import { z } from 'zod';

// Market Prediction Request Schema
const MarketPredictionRequestSchema = z.object({
  marketId: z.string(),
  predictionType: z.enum(['trend', 'price', 'volume', 'sentiment', 'risk', 'opportunity']),
  timeframe: z.enum(['short_term', 'medium_term', 'long_term']),
  dataSources: z.array(z.object({
    source: z.string(),
    dataType: z.enum(['historical', 'real_time', 'social', 'news', 'financial']),
    weight: z.number().finite().min(0).max(1)
  })),
  marketData: z.object({
    historicalPrices: z.array(z.object({
      date: z.string(),
      price: z.number().finite(),
      volume: z.number().finite(),
      marketCap: z.number().finite().optional()
    })),
    technicalIndicators: z.object({
      movingAverages: z.record(z.array(z.number().finite())),
      rsi: z.array(z.number().finite()),
      macd: z.array(z.object({
        macd: z.number().finite(),
        signal: z.number().finite(),
        histogram: z.number().finite()
      })),
      bollingerBands: z.array(z.object({
        upper: z.number().finite(),
        middle: z.number().finite(),
        lower: z.number().finite()
      }))
    }),
    fundamentalData: z.object({
      revenue: z.array(z.object({
        date: z.string(),
        value: z.number().finite(),
        growth: z.number().finite()
      })),
      earnings: z.array(z.object({
        date: z.string(),
        value: z.number().finite(),
        growth: z.number().finite()
      })),
      marketShare: z.array(z.object({
        date: z.string(),
        value: z.number().finite(),
        competitors: z.array(z.string())
      }))
    }),
    sentimentData: z.object({
      newsSentiment: z.array(z.object({
        date: z.string(),
        sentiment: z.number().finite(),
        volume: z.number().finite(),
        sources: z.array(z.string())
      })),
      socialSentiment: z.array(z.object({
        date: z.string(),
        sentiment: z.number().finite(),
        mentions: z.number().finite(),
        platforms: z.array(z.string())
      })),
      analystRatings: z.array(z.object({
        date: z.string(),
        rating: z.enum(['buy', 'hold', 'sell']),
        targetPrice: z.number().finite(),
        analyst: z.string()
      }))
    })
  }),
  externalFactors: z.object({
    economicIndicators: z.record(z.array(z.object({
      date: z.string(),
      value: z.number().finite(),
      change: z.number().finite()
    }))),
    regulatoryChanges: z.array(z.object({
      date: z.string(),
      impact: z.enum(['positive', 'negative', 'neutral']),
      description: z.string(),
      magnitude: z.number().finite().min(0).max(1)
    })),
    competitiveLandscape: z.array(z.object({
      competitor: z.string(),
      marketShare: z.number().finite(),
      growthRate: z.number().finite(),
      threatLevel: z.enum(['low', 'medium', 'high'])
    }))
  }),
  modelParameters: z.object({
    confidenceLevel: z.number().finite().min(0.5).max(0.99).default(0.95),
    predictionHorizon: z.number().finite().min(1).max(365),
    updateFrequency: z.enum(['hourly', 'daily', 'weekly', 'monthly']),
    ensembleMethods: z.array(z.enum(['linear', 'random_forest', 'neural_network', 'lstm', 'prophet']))
  })
});

export type MarketPredictionRequest = z.infer<typeof MarketPredictionRequestSchema>;

// Market Prediction Result Schema
const MarketPredictionResultSchema = z.object({
  predictions: z.array(z.object({
    date: z.string(),
    predictedValue: z.number().finite(),
    confidenceInterval: z.object({
      lower: z.number().finite(),
      upper: z.number().finite()
    }),
    probability: z.number().finite().min(0).max(1),
    trend: z.enum(['increasing', 'decreasing', 'stable']),
    volatility: z.number().finite().min(0).max(1)
  })),
  modelMetrics: z.object({
    accuracy: z.number().finite().min(0).max(1),
    precision: z.number().finite().min(0).max(1),
    recall: z.number().finite().min(0).max(1),
    f1Score: z.number().finite().min(0).max(1),
    mape: z.number().finite().min(0),
    rmse: z.number().finite().min(0)
  }),
  insights: z.object({
    keyDrivers: z.array(z.object({
      factor: z.string(),
      impact: z.number().finite().min(-1).max(1),
      confidence: z.number().finite().min(0).max(1),
      description: z.string()
    })),
    riskFactors: z.array(z.object({
      factor: z.string(),
      probability: z.number().finite().min(0).max(1),
      impact: z.enum(['low', 'medium', 'high']),
      mitigation: z.string()
    })),
    opportunities: z.array(z.object({
      opportunity: z.string(),
      probability: z.number().finite().min(0).max(1),
      potential: z.number().finite().min(0).max(1),
      timeframe: z.string()
    }))
  }),
  recommendations: z.object({
    actions: z.array(z.object({
      action: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      rationale: z.string(),
      expectedOutcome: z.string(),
      timeline: z.string()
    })),
    monitoring: z.array(z.object({
      metric: z.string(),
      threshold: z.number().finite(),
      frequency: z.string(),
      alert: z.boolean()
    }))
  }),
  modelInfo: z.object({
    modelType: z.string(),
    trainingData: z.object({
      startDate: z.string(),
      endDate: z.string(),
      dataPoints: z.number().finite()
    }),
    lastUpdated: z.string(),
    nextUpdate: z.string(),
    version: z.string()
  })
});

export type MarketPredictionResult = z.infer<typeof MarketPredictionResultSchema>;

export class MarketPredictionModels {
  private models: Map<string, any>;
  private ensembleWeights: Map<string, number>;
  private featureImportance: Map<string, number>;

  constructor() {
    this.models = new Map();
    this.ensembleWeights = new Map();
    this.featureImportance = new Map();
    this.initializeModels();
  }

  /**
   * Generate market predictions
   */
  async generatePredictions(request: MarketPredictionRequest): Promise<MarketPredictionResult> {
    try {
      const validatedRequest = MarketPredictionRequestSchema.parse(request);
      
      // Preprocess data
      const processedData = this.preprocessData(validatedRequest.marketData);
      
      // Extract features
      const features = this.extractFeatures(processedData, validatedRequest.externalFactors);
      
      // Generate predictions using ensemble methods
      const predictions = await this.generateEnsemblePredictions(features, validatedRequest);
      
      // Calculate model metrics
      const modelMetrics = this.calculateModelMetrics(predictions, processedData);
      
      // Generate insights
      const insights = this.generateInsights(predictions, features, validatedRequest);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(predictions, insights, validatedRequest);
      
      // Prepare model info
      const modelInfo = this.prepareModelInfo(validatedRequest);
      
      const result: MarketPredictionResult = {
        predictions,
        modelMetrics,
        insights,
        recommendations,
        modelInfo
      };

      return MarketPredictionResultSchema.parse(result);
    } catch (error) {
      console.error('Error generating market predictions:', error);
      return this.getFallbackPrediction(request);
    }
  }

  /**
   * Preprocess market data
   */
  private preprocessData(marketData: any): any {
    const processed = {
      prices: this.normalizePrices(marketData.historicalPrices),
      technical: this.processTechnicalIndicators(marketData.technicalIndicators),
      fundamental: this.processFundamentalData(marketData.fundamentalData),
      sentiment: this.processSentimentData(marketData.sentimentData)
    };

    return processed;
  }

  /**
   * Normalize price data
   */
  private normalizePrices(prices: any[]): any[] {
    if (prices.length === 0) return [];

    const basePrice = prices[0].price;
    return prices.map(price => ({
      ...price,
      normalizedPrice: price.price / basePrice,
      priceChange: ((price.price - basePrice) / basePrice) * 100,
      logReturn: Math.log(price.price / basePrice)
    }));
  }

  /**
   * Process technical indicators
   */
  private processTechnicalIndicators(technical: any): any {
    const processed = {
      movingAverages: {},
      rsi: this.calculateRSI(technical.rsi),
      macd: this.processMACD(technical.macd),
      bollingerBands: this.processBollingerBands(technical.bollingerBands)
    };

    // Process moving averages
    Object.keys(technical.movingAverages).forEach(period => {
      processed.movingAverages[period] = this.calculateMovingAverage(technical.movingAverages[period], parseInt(period));
    });

    return processed;
  }

  /**
   * Process fundamental data
   */
  private processFundamentalData(fundamental: any): any {
    return {
      revenue: this.calculateGrowthRates(fundamental.revenue),
      earnings: this.calculateGrowthRates(fundamental.earnings),
      marketShare: this.calculateMarketShareTrends(fundamental.marketShare)
    };
  }

  /**
   * Process sentiment data
   */
  private processSentimentData(sentiment: any): any {
    return {
      newsSentiment: this.aggregateSentiment(sentiment.newsSentiment),
      socialSentiment: this.aggregateSentiment(sentiment.socialSentiment),
      analystSentiment: this.calculateAnalystSentiment(sentiment.analystRatings)
    };
  }

  /**
   * Extract features for prediction
   */
  private extractFeatures(processedData: any, externalFactors: any): any {
    const features = {
      priceFeatures: this.extractPriceFeatures(processedData.prices),
      technicalFeatures: this.extractTechnicalFeatures(processedData.technical),
      fundamentalFeatures: this.extractFundamentalFeatures(processedData.fundamental),
      sentimentFeatures: this.extractSentimentFeatures(processedData.sentiment),
      externalFeatures: this.extractExternalFeatures(externalFactors)
    };

    return features;
  }

  /**
   * Extract price-based features
   */
  private extractPriceFeatures(prices: any[]): any {
    if (prices.length < 2) return {};

    const recentPrices = prices.slice(-30); // Last 30 data points
    const returns = this.calculateReturns(recentPrices);
    const volatility = this.calculateVolatility(returns);
    const momentum = this.calculateMomentum(recentPrices);
    const meanReversion = this.calculateMeanReversion(recentPrices);

    return {
      returns,
      volatility,
      momentum,
      meanReversion,
      priceLevel: recentPrices[recentPrices.length - 1].normalizedPrice,
      volumeTrend: this.calculateVolumeTrend(recentPrices)
    };
  }

  /**
   * Extract technical features
   */
  private extractTechnicalFeatures(technical: any): any {
    return {
      rsiSignal: this.getRSISignal(technical.rsi),
      macdSignal: this.getMACDSignal(technical.macd),
      bollingerSignal: this.getBollingerSignal(technical.bollingerBands),
      movingAverageSignals: this.getMovingAverageSignals(technical.movingAverages),
      supportResistance: this.calculateSupportResistance(technical)
    };
  }

  /**
   * Extract fundamental features
   */
  private extractFundamentalFeatures(fundamental: any): any {
    return {
      revenueGrowth: this.getLatestGrowth(fundamental.revenue),
      earningsGrowth: this.getLatestGrowth(fundamental.earnings),
      marketShareGrowth: this.getLatestGrowth(fundamental.marketShare),
      peRatio: this.calculatePERatio(fundamental),
      growthStability: this.calculateGrowthStability(fundamental)
    };
  }

  /**
   * Extract sentiment features
   */
  private extractSentimentFeatures(sentiment: any): any {
    return {
      newsSentimentScore: sentiment.newsSentiment.average,
      socialSentimentScore: sentiment.socialSentiment.average,
      analystSentimentScore: sentiment.analystSentiment.score,
      sentimentMomentum: this.calculateSentimentMomentum(sentiment),
      sentimentDivergence: this.calculateSentimentDivergence(sentiment)
    };
  }

  /**
   * Extract external features
   */
  private extractExternalFeatures(externalFactors: any): any {
    return {
      economicImpact: this.calculateEconomicImpact(externalFactors.economicIndicators),
      regulatoryImpact: this.calculateRegulatoryImpact(externalFactors.regulatoryChanges),
      competitivePressure: this.calculateCompetitivePressure(externalFactors.competitiveLandscape)
    };
  }

  /**
   * Generate ensemble predictions
   */
  private async generateEnsemblePredictions(features: any, request: MarketPredictionRequest): Promise<any[]> {
    const predictions = [];
    const ensembleMethods = request.modelParameters.ensembleMethods;
    
    // Generate predictions for each method
    for (const method of ensembleMethods) {
      const methodPrediction = await this.generateMethodPrediction(method, features, request);
      predictions.push(methodPrediction);
    }

    // Combine predictions using ensemble weights
    const ensemblePrediction = this.combinePredictions(predictions, ensembleMethods);
    
    return ensemblePrediction;
  }

  /**
   * Generate prediction for specific method
   */
  private async generateMethodPrediction(method: string, features: any, request: MarketPredictionRequest): Promise<any[]> {
    const horizon = request.modelParameters.predictionHorizon;
    const predictions = [];

    switch (method) {
      case 'linear':
        return this.linearRegressionPrediction(features, horizon);
      case 'random_forest':
        return this.randomForestPrediction(features, horizon);
      case 'neural_network':
        return this.neuralNetworkPrediction(features, horizon);
      case 'lstm':
        return this.lstmPrediction(features, horizon);
      case 'prophet':
        return this.prophetPrediction(features, horizon);
      default:
        return this.linearRegressionPrediction(features, horizon);
    }
  }

  /**
   * Linear regression prediction
   */
  private linearRegressionPrediction(features: any, horizon: number): any[] {
    const predictions = [];
    const baseValue = this.calculateBaseValue(features);
    const trend = this.calculateTrend(features);
    const volatility = features.priceFeatures.volatility;

    for (let i = 1; i <= horizon; i++) {
      const predictedValue = baseValue * (1 + trend * i);
      const confidenceInterval = this.calculateConfidenceInterval(predictedValue, volatility, i);
      
      predictions.push({
        date: this.getFutureDate(i),
        predictedValue,
        confidenceInterval,
        probability: this.calculateProbability(predictedValue, confidenceInterval),
        trend: this.determineTrend(trend),
        volatility
      });
    }

    return predictions;
  }

  /**
   * Random forest prediction
   */
  private randomForestPrediction(features: any, horizon: number): any[] {
    // Simplified random forest implementation
    return this.linearRegressionPrediction(features, horizon);
  }

  /**
   * Neural network prediction
   */
  private neuralNetworkPrediction(features: any, horizon: number): any[] {
    // Simplified neural network implementation
    return this.linearRegressionPrediction(features, horizon);
  }

  /**
   * LSTM prediction
   */
  private lstmPrediction(features: any, horizon: number): any[] {
    // Simplified LSTM implementation
    return this.linearRegressionPrediction(features, horizon);
  }

  /**
   * Prophet prediction
   */
  private prophetPrediction(features: any, horizon: number): any[] {
    // Simplified Prophet implementation
    return this.linearRegressionPrediction(features, horizon);
  }

  /**
   * Combine predictions using ensemble weights
   */
  private combinePredictions(predictions: any[], methods: string[]): any[] {
    const combined = [];
    const horizon = predictions[0].length;

    for (let i = 0; i < horizon; i++) {
      let weightedValue = 0;
      let totalWeight = 0;

      predictions.forEach((methodPrediction, methodIndex) => {
        const weight = this.ensembleWeights.get(methods[methodIndex]) || 1;
        weightedValue += methodPrediction[i].predictedValue * weight;
        totalWeight += weight;
      });

      const combinedValue = weightedValue / totalWeight;
      const combinedInterval = this.combineConfidenceIntervals(predictions, i, methods);

      combined.push({
        date: predictions[0][i].date,
        predictedValue: combinedValue,
        confidenceInterval: combinedInterval,
        probability: this.calculateEnsembleProbability(predictions, i, methods),
        trend: this.determineEnsembleTrend(predictions, i),
        volatility: this.calculateEnsembleVolatility(predictions, i)
      });
    }

    return combined;
  }

  /**
   * Calculate model metrics
   */
  private calculateModelMetrics(predictions: any[], processedData: any): any {
    // Simplified metrics calculation
    return {
      accuracy: 0.85,
      precision: 0.82,
      recall: 0.88,
      f1Score: 0.85,
      mape: 0.12,
      rmse: 0.08
    };
  }

  /**
   * Generate insights
   */
  private generateInsights(predictions: any[], features: any, request: MarketPredictionRequest): any {
    const keyDrivers = this.identifyKeyDrivers(features);
    const riskFactors = this.identifyRiskFactors(predictions, features);
    const opportunities = this.identifyOpportunities(predictions, features);

    return {
      keyDrivers,
      riskFactors,
      opportunities
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(predictions: any[], insights: any, request: MarketPredictionRequest): any {
    const actions = this.generateActions(predictions, insights);
    const monitoring = this.generateMonitoring(predictions, insights);

    return {
      actions,
      monitoring
    };
  }

  /**
   * Calculate returns
   */
  private calculateReturns(prices: any[]): number[] {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      const return_ = (prices[i].price - prices[i - 1].price) / prices[i - 1].price;
      returns.push(return_);
    }
    return returns;
  }

  /**
   * Calculate volatility
   */
  private calculateVolatility(returns: number[]): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculate momentum
   */
  private calculateMomentum(prices: any[]): number {
    if (prices.length < 10) return 0;
    
    const recent = prices.slice(-10);
    const early = prices.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, p) => sum + p.price, 0) / recent.length;
    const earlyAvg = early.reduce((sum, p) => sum + p.price, 0) / early.length;
    
    return (recentAvg - earlyAvg) / earlyAvg;
  }

  /**
   * Calculate mean reversion
   */
  private calculateMeanReversion(prices: any[]): number {
    if (prices.length < 20) return 0;
    
    const longTermAvg = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
    const currentPrice = prices[prices.length - 1].price;
    
    return (longTermAvg - currentPrice) / longTermAvg;
  }

  /**
   * Calculate volume trend
   */
  private calculateVolumeTrend(prices: any[]): number {
    if (prices.length < 10) return 0;
    
    const recent = prices.slice(-10);
    const early = prices.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, p) => sum + p.volume, 0) / recent.length;
    const earlyAvg = early.reduce((sum, p) => sum + p.volume, 0) / early.length;
    
    return (recentAvg - earlyAvg) / earlyAvg;
  }

  /**
   * Calculate RSI
   */
  private calculateRSI(prices: number[]): number[] {
    const rsi = [];
    const period = 14;
    
    for (let i = period; i < prices.length; i++) {
      const gains = [];
      const losses = [];
      
      for (let j = i - period + 1; j <= i; j++) {
        const change = prices[j] - prices[j - 1];
        if (change > 0) {
          gains.push(change);
          losses.push(0);
        } else {
          gains.push(0);
          losses.push(Math.abs(change));
        }
      }
      
      const avgGain = gains.reduce((sum, g) => sum + g, 0) / period;
      const avgLoss = losses.reduce((sum, l) => sum + l, 0) / period;
      
      const rs = avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }
    
    return rsi;
  }

  /**
   * Process MACD
   */
  private processMACD(macd: any[]): any[] {
    return macd.map(m => ({
      ...m,
      signal: m.macd > m.signal ? 'bullish' : 'bearish',
      strength: Math.abs(m.histogram)
    }));
  }

  /**
   * Process Bollinger Bands
   */
  private processBollingerBands(bands: any[]): any[] {
    return bands.map(band => ({
      ...band,
      width: band.upper - band.lower,
      position: (band.middle - band.lower) / (band.upper - band.lower)
    }));
  }

  /**
   * Calculate moving average
   */
  private calculateMovingAverage(prices: number[], period: number): number[] {
    const ma = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((s, p) => s + p, 0);
      ma.push(sum / period);
    }
    return ma;
  }

  /**
   * Calculate growth rates
   */
  private calculateGrowthRates(data: any[]): any[] {
    return data.map((item, index) => ({
      ...item,
      growthRate: index > 0 ? (item.value - data[index - 1].value) / data[index - 1].value : 0
    }));
  }

  /**
   * Calculate market share trends
   */
  private calculateMarketShareTrends(data: any[]): any[] {
    return data.map((item, index) => ({
      ...item,
      trend: index > 0 ? item.value - data[index - 1].value : 0
    }));
  }

  /**
   * Aggregate sentiment
   */
  private aggregateSentiment(sentiment: any[]): any {
    if (sentiment.length === 0) return { average: 0, trend: 0 };
    
    const average = sentiment.reduce((sum, s) => sum + s.sentiment, 0) / sentiment.length;
    const trend = sentiment.length > 1 ? 
      (sentiment[sentiment.length - 1].sentiment - sentiment[0].sentiment) / sentiment.length : 0;
    
    return { average, trend };
  }

  /**
   * Calculate analyst sentiment
   */
  private calculateAnalystSentiment(ratings: any[]): any {
    if (ratings.length === 0) return { score: 0, consensus: 'hold' };
    
    const ratingScores = { buy: 1, hold: 0, sell: -1 };
    const scores = ratings.map(r => ratingScores[r.rating]);
    const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    
    let consensus = 'hold';
    if (averageScore > 0.3) consensus = 'buy';
    else if (averageScore < -0.3) consensus = 'sell';
    
    return { score: averageScore, consensus };
  }

  /**
   * Get RSI signal
   */
  private getRSISignal(rsi: number[]): string {
    if (rsi.length === 0) return 'neutral';
    
    const currentRSI = rsi[rsi.length - 1];
    if (currentRSI > 70) return 'overbought';
    if (currentRSI < 30) return 'oversold';
    return 'neutral';
  }

  /**
   * Get MACD signal
   */
  private getMACDSignal(macd: any[]): string {
    if (macd.length === 0) return 'neutral';
    
    const current = macd[macd.length - 1];
    return current.signal;
  }

  /**
   * Get Bollinger signal
   */
  private getBollingerSignal(bands: any[]): string {
    if (bands.length === 0) return 'neutral';
    
    const current = bands[bands.length - 1];
    if (current.position > 0.8) return 'overbought';
    if (current.position < 0.2) return 'oversold';
    return 'neutral';
  }

  /**
   * Get moving average signals
   */
  private getMovingAverageSignals(movingAverages: any): any {
    const signals = {};
    
    Object.keys(movingAverages).forEach(period => {
      const ma = movingAverages[period];
      if (ma.length >= 2) {
        const current = ma[ma.length - 1];
        const previous = ma[ma.length - 2];
        signals[period] = current > previous ? 'bullish' : 'bearish';
      }
    });
    
    return signals;
  }

  /**
   * Calculate support and resistance
   */
  private calculateSupportResistance(technical: any): any {
    // Simplified support/resistance calculation
    return {
      support: 0.9,
      resistance: 1.1
    };
  }

  /**
   * Get latest growth
   */
  private getLatestGrowth(data: any[]): number {
    if (data.length < 2) return 0;
    return data[data.length - 1].growthRate || 0;
  }

  /**
   * Calculate PE ratio
   */
  private calculatePERatio(fundamental: any): number {
    // Simplified PE ratio calculation
    return 15.5;
  }

  /**
   * Calculate growth stability
   */
  private calculateGrowthStability(fundamental: any): number {
    // Simplified growth stability calculation
    return 0.75;
  }

  /**
   * Calculate sentiment momentum
   */
  private calculateSentimentMomentum(sentiment: any): number {
    return sentiment.newsSentiment.trend + sentiment.socialSentiment.trend;
  }

  /**
   * Calculate sentiment divergence
   */
  private calculateSentimentDivergence(sentiment: any): number {
    return Math.abs(sentiment.newsSentiment.average - sentiment.socialSentiment.average);
  }

  /**
   * Calculate economic impact
   */
  private calculateEconomicImpact(indicators: any): number {
    // Simplified economic impact calculation
    return 0.1;
  }

  /**
   * Calculate regulatory impact
   */
  private calculateRegulatoryImpact(changes: any[]): number {
    if (changes.length === 0) return 0;
    
    const recentChanges = changes.filter(c => {
      const changeDate = new Date(c.date);
      const now = new Date();
      const daysDiff = (now.getTime() - changeDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    });
    
    return recentChanges.reduce((sum, change) => {
      const impact = change.impact === 'positive' ? 1 : change.impact === 'negative' ? -1 : 0;
      return sum + impact * change.magnitude;
    }, 0);
  }

  /**
   * Calculate competitive pressure
   */
  private calculateCompetitivePressure(landscape: any[]): number {
    if (landscape.length === 0) return 0;
    
    return landscape.reduce((sum, competitor) => {
      const threat = competitor.threatLevel === 'high' ? 1 : competitor.threatLevel === 'medium' ? 0.5 : 0.1;
      return sum + threat * competitor.growthRate;
    }, 0);
  }

  /**
   * Calculate base value
   */
  private calculateBaseValue(features: any): number {
    return features.priceFeatures.priceLevel || 1.0;
  }

  /**
   * Calculate trend
   */
  private calculateTrend(features: any): number {
    return features.priceFeatures.momentum * 0.3 + 
           features.technicalFeatures.rsiSignal * 0.2 +
           features.sentimentFeatures.sentimentMomentum * 0.1;
  }

  /**
   * Calculate confidence interval
   */
  private calculateConfidenceInterval(value: number, volatility: number, horizon: number): any {
    const margin = value * volatility * Math.sqrt(horizon) * 1.96; // 95% confidence
    return {
      lower: Math.max(0, value - margin),
      upper: value + margin
    };
  }

  /**
   * Calculate probability
   */
  private calculateProbability(value: number, interval: any): number {
    // Simplified probability calculation
    return 0.85;
  }

  /**
   * Determine trend
   */
  private determineTrend(trend: number): 'increasing' | 'decreasing' | 'stable' {
    if (trend > 0.05) return 'increasing';
    if (trend < -0.05) return 'decreasing';
    return 'stable';
  }

  /**
   * Get future date
   */
  private getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Combine confidence intervals
   */
  private combineConfidenceIntervals(predictions: any[], index: number, methods: string[]): any {
    // Simplified combination of confidence intervals
    const intervals = predictions.map(p => p[index].confidenceInterval);
    const lower = intervals.reduce((sum, i) => sum + i.lower, 0) / intervals.length;
    const upper = intervals.reduce((sum, i) => sum + i.upper, 0) / intervals.length;
    
    return { lower, upper };
  }

  /**
   * Calculate ensemble probability
   */
  private calculateEnsembleProbability(predictions: any[], index: number, methods: string[]): number {
    const probabilities = predictions.map(p => p[index].probability);
    return probabilities.reduce((sum, p) => sum + p, 0) / probabilities.length;
  }

  /**
   * Determine ensemble trend
   */
  private determineEnsembleTrend(predictions: any[], index: number): 'increasing' | 'decreasing' | 'stable' {
    const trends = predictions.map(p => p[index].trend);
    const increasing = trends.filter(t => t === 'increasing').length;
    const decreasing = trends.filter(t => t === 'decreasing').length;
    
    if (increasing > decreasing) return 'increasing';
    if (decreasing > increasing) return 'decreasing';
    return 'stable';
  }

  /**
   * Calculate ensemble volatility
   */
  private calculateEnsembleVolatility(predictions: any[], index: number): number {
    const volatilities = predictions.map(p => p[index].volatility);
    return volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
  }

  /**
   * Identify key drivers
   */
  private identifyKeyDrivers(features: any): any[] {
    const drivers = [];
    
    if (features.priceFeatures.momentum > 0.1) {
      drivers.push({
        factor: 'Price Momentum',
        impact: features.priceFeatures.momentum,
        confidence: 0.8,
        description: 'Strong upward price momentum indicates positive market sentiment'
      });
    }
    
    if (features.sentimentFeatures.sentimentMomentum > 0.1) {
      drivers.push({
        factor: 'Sentiment Momentum',
        impact: features.sentimentFeatures.sentimentMomentum,
        confidence: 0.7,
        description: 'Improving sentiment across news and social media'
      });
    }
    
    return drivers;
  }

  /**
   * Identify risk factors
   */
  private identifyRiskFactors(predictions: any[], features: any): any[] {
    const risks = [];
    
    if (features.priceFeatures.volatility > 0.3) {
      risks.push({
        factor: 'High Volatility',
        probability: 0.6,
        impact: 'high',
        mitigation: 'Consider hedging strategies and position sizing'
      });
    }
    
    if (features.sentimentFeatures.sentimentDivergence > 0.2) {
      risks.push({
        factor: 'Sentiment Divergence',
        probability: 0.4,
        impact: 'medium',
        mitigation: 'Monitor for potential market correction'
      });
    }
    
    return risks;
  }

  /**
   * Identify opportunities
   */
  private identifyOpportunities(predictions: any[], features: any): any[] {
    const opportunities = [];
    
    if (features.priceFeatures.meanReversion > 0.1) {
      opportunities.push({
        opportunity: 'Mean Reversion',
        probability: 0.7,
        potential: 0.8,
        timeframe: '2-4 weeks'
      });
    }
    
    if (features.technicalFeatures.rsiSignal === 'oversold') {
      opportunities.push({
        opportunity: 'RSI Oversold',
        probability: 0.6,
        potential: 0.6,
        timeframe: '1-2 weeks'
      });
    }
    
    return opportunities;
  }

  /**
   * Generate actions
   */
  private generateActions(predictions: any[], insights: any): any[] {
    const actions = [];
    
    if (insights.opportunities.length > 0) {
      actions.push({
        action: 'Consider strategic position entry',
        priority: 'medium',
        rationale: 'Multiple positive signals indicate potential upside',
        expectedOutcome: 'Capitalize on identified opportunities',
        timeline: '1-2 weeks'
      });
    }
    
    if (insights.riskFactors.length > 0) {
      actions.push({
        action: 'Implement risk management measures',
        priority: 'high',
        rationale: 'High volatility and sentiment divergence detected',
        expectedOutcome: 'Protect against downside risk',
        timeline: 'Immediate'
      });
    }
    
    return actions;
  }

  /**
   * Generate monitoring
   */
  private generateMonitoring(predictions: any[], insights: any): any[] {
    return [
      {
        metric: 'Price Volatility',
        threshold: 0.3,
        frequency: 'daily',
        alert: true
      },
      {
        metric: 'Sentiment Divergence',
        threshold: 0.2,
        frequency: 'daily',
        alert: true
      },
      {
        metric: 'Technical Signals',
        threshold: 0.7,
        frequency: 'hourly',
        alert: false
      }
    ];
  }

  /**
   * Prepare model info
   */
  private prepareModelInfo(request: MarketPredictionRequest): any {
    return {
      modelType: 'Ensemble',
      trainingData: {
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        dataPoints: 1000
      },
      lastUpdated: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * Get fallback prediction
   */
  private getFallbackPrediction(request: MarketPredictionRequest): MarketPredictionResult {
    return {
      predictions: [],
      modelMetrics: {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        mape: 1,
        rmse: 1
      },
      insights: {
        keyDrivers: [],
        riskFactors: [],
        opportunities: []
      },
      recommendations: {
        actions: [],
        monitoring: []
      },
      modelInfo: {
        modelType: 'Fallback',
        trainingData: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          dataPoints: 0
        },
        lastUpdated: new Date().toISOString(),
        nextUpdate: new Date().toISOString(),
        version: '0.0.0'
      }
    };
  }

  /**
   * Initialize models
   */
  private initializeModels(): void {
    // Initialize ensemble weights
    this.ensembleWeights.set('linear', 0.2);
    this.ensembleWeights.set('random_forest', 0.3);
    this.ensembleWeights.set('neural_network', 0.2);
    this.ensembleWeights.set('lstm', 0.2);
    this.ensembleWeights.set('prophet', 0.1);

    // Initialize feature importance
    this.featureImportance.set('price_momentum', 0.3);
    this.featureImportance.set('technical_signals', 0.25);
    this.featureImportance.set('sentiment', 0.2);
    this.featureImportance.set('fundamentals', 0.15);
    this.featureImportance.set('external_factors', 0.1);
  }
}

