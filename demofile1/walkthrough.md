# SocioSphere Project Walkthrough

## Prerequisites
- Docker and Docker Compose must be installed and running.
- You have updated the configuration with your current IP address (already done).

## Steps to Run the Project

1.  **Start the Application**:
    Run the following command in your terminal (at the project root):
    ```bash
    docker-compose up --build
    ```
    (I will run this for you in the background).

2.  **Access the Application**:
    Once the containers are running, you can access the application at:
    - **Client (Frontend)**: [http://192.168.29.204:3000](http://192.168.29.204:3000)
    - **Server (Backend API)**: [http://192.168.29.204:5000](http://192.168.29.204:5000)

3.  **Verify Functionality**:
    - Register a new user.
    - Create a post.
    - Like and comment on posts.

## Troubleshooting
- If the client cannot connect to the server, ensure your firewall allows traffic on ports 3000 and 5000.
- If the IP address changes again, you will need to update `docker-compose.yml` and restart the containers.
