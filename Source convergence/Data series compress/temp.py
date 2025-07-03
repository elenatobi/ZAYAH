class DataSeries:
    def __init__(self, data = []):
        self.data = data
        
    def __check(self, other):
        if type(other) != DataSeries:
            raise Exception("other must be DataSeries")
        if len(self.data) != len(other.data):
            raise Exception("Inconsistency between self and other")
        
    def __add__(self, other):
        self.__check(other)
        sum = []
        for i in range(len(self.data)):
            sum.append(self.data[i] + other.data[i])
        return DataSeries(sum)
        
    def __sub__(self, other):
        self.__check(other)
        difference = []
        for i in range(len(self.data)):
            difference.append(self.data[i] - other.data[i])
        return DataSeries(difference)
        
    def __setitem__(self, key, value):
        self.data[key] = value
        
    def __getitem__(self, key):
        return self.data[key]
        
    def __len__(self):
        return len(self.data)
        
    def __iter__(self):
        for item in self.data:
            yield item
            
    def __repr__(self):
        return f"DataSeries{self.data}"
        
    def append(self, value):
        self.data.append(value)
        
a = DataSeries([100782500000, 201410177785, 301604927767, 402780642400, 503531148800, 604494259400, 705274900000])
b = DataSeries([a[0]*i for i in range(1, 7+1)])
    
print("a:", a)
print("b:", b)
print("b-a:", b-a)