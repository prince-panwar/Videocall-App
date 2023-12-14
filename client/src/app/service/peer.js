class PeerService {
    constructor() {
      // Initialize peer connection only on the client
      if (typeof window !== 'undefined') {
        try {
          this.peer = new RTCPeerConnection({
            iceServers: [
              {
                urls: [
                  'stun:stun.l.google.com:19302',
                  'stun:global.stun.twilio.com:3478',
                ],
              },
            ],
          });
        } catch (error) {
          console.error('Error initializing RTCPeerConnection:', error);
        }
      }
    }
  
    async getAnswer(offer) {
      if (this.peer) {
        try {
          await this.peer.setRemoteDescription(offer);
          const ans = await this.peer.createAnswer();
          await this.peer.setLocalDescription(new RTCSessionDescription(ans));
          return ans;
        } catch (error) {
          console.error('Error generating answer:', error);
          throw error; // Propagate the error to the caller
        }
      }
    }
  
    async setLocalDescription(ans) {
      if (this.peer) {
        try {
          await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        } catch (error) {
          console.error('Error setting local description:', error);
          throw error;
        }
      }
    }
  
    async getOffer() {
      if (this.peer) {
        try {
          const offer = await this.peer.createOffer();
          await this.peer.setLocalDescription(new RTCSessionDescription(offer));
          return offer;
        } catch (error) {
          console.error('Error generating offer:', error);
          throw error;
        }
      }
    }
  }
  
  export default new PeerService();
  