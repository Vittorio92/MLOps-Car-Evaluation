from azure.storage.blob import BlobServiceClient

def get_blob_service(connection_string: str) -> BlobServiceClient:
    return BlobServiceClient.from_connection_string(connection_string)

def get_container_client(bsc: BlobServiceClient, container: str):
    return bsc.get_container_client(container)

def get_blob_client(bsc: BlobServiceClient, container: str, blob: str):
    return bsc.get_blob_client(container=container, blob=blob)
