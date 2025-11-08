import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Camera, 
  Upload, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Leaf,
  Droplets,
  Bug,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockDiseases = [
  {
    name: 'Leaf Blight',
    confidence: 89,
    severity: 'Medium',
    color: 'text-amber-600',
    solution: 'Apply copper-based fungicide. Remove affected leaves.',
    prevention: 'Ensure proper spacing and ventilation.'
  },
  {
    name: 'Bacterial Wilt',
    confidence: 76,
    severity: 'High',
    color: 'text-red-600',
    solution: 'Use resistant varieties. Apply bactericide.',
    prevention: 'Avoid overwatering. Use clean tools.'
  },
  {
    name: 'Nutrient Deficiency',
    confidence: 92,
    severity: 'Low',
    color: 'text-green-600',
    solution: 'Apply balanced NPK fertilizer.',
    prevention: 'Regular soil testing and fertilization.'
  }
];

export function AICropDoctor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      setAnalysisResult(randomDisease);
      setIsAnalyzing(false);
      toast.success('Analysis complete! Check the results below.');
    }, 3000);
  };

  const takePicture = () => {
    // Simulate camera capture with a placeholder
    setUploadedImage('https://images.unsplash.com/photo-1695566371955-5f07b6443657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwYWdyaWN1bHR1cmUlMjBjcm9wc3xlbnwxfHx8fDE3NTgzNTA5MjJ8MA&ixlib=rb-4.1.0&q=80&w=400');
    analyzeImage();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            AI Crop Doctor
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
              <Zap className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Upload crop photos for instant disease detection and treatment recommendations
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded crop" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setUploadedImage(null);
                        setAnalysisResult(null);
                      }}
                    >
                      Upload New Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Upload Crop Image</h3>
                      <p className="text-sm text-muted-foreground">
                        Take a photo or upload from gallery
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button onClick={takePicture} className="flex items-center">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button variant="outline" asChild>
                        <label className="cursor-pointer flex items-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-blue-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Analyzing Image...</p>
                      <p className="text-sm text-blue-600">AI is examining your crop for diseases</p>
                      <Progress value={Math.random() * 100} className="mt-2" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {analysisResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Detection Results</h3>
                      <Badge 
                        variant={analysisResult.severity === 'High' ? 'destructive' : 
                               analysisResult.severity === 'Medium' ? 'secondary' : 'default'}
                      >
                        {analysisResult.severity} Risk
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{analysisResult.name}</span>
                        <span className={`font-bold ${analysisResult.color}`}>
                          {analysisResult.confidence}% confident
                        </span>
                      </div>
                      
                      <Progress value={analysisResult.confidence} className="h-2" />
                      
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Treatment</p>
                            <p className="text-sm text-muted-foreground">
                              {analysisResult.solution}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Prevention</p>
                            <p className="text-sm text-muted-foreground">
                              {analysisResult.prevention}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="text-xs">
                      <Droplets className="w-3 h-3 mr-1" />
                      Water Schedule
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Bug className="w-3 h-3 mr-1" />
                      Pest Control
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an image to get instant crop diagnosis</p>
                  <p className="text-sm">AI-powered disease detection in seconds</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}