// Simple global API cache to prevent duplicate requests
class APICache {
  private cache = new Map<string, any>();
  private pendingRequests = new Map<string, Promise<any>>();

  async fetch<T>(url: string): Promise<T> {
    // Check if we have cached data
    if (this.cache.has(url)) {
      console.log(`📋 Using cached data for ${url}`);
      return this.cache.get(url);
    }

    // Check if there's already a pending request
    if (this.pendingRequests.has(url)) {
      console.log(`⏳ Waiting for pending request ${url}`);
      return this.pendingRequests.get(url);
    }

    // Make new request
    console.log(`🌐 Making fresh API call to ${url}`);
    const promise = window.fetch(url).then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Cache the result
      this.cache.set(url, data);
      
      // Remove from pending
      this.pendingRequests.delete(url);
      
      return data;
    }).catch((error) => {
      // Remove from pending on error
      this.pendingRequests.delete(url);
      throw error;
    });

    // Store as pending
    this.pendingRequests.set(url, promise);
    
    return promise;
  }

  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  clearUrl(url: string) {
    this.cache.delete(url);
    this.pendingRequests.delete(url);
  }
}

export const apiCache = new APICache();