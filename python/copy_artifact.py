# This script copies the EduMetaCoinErc20 contract artifact from the project root artifacts directory to the python/artifacts directory.
import os
import shutil

SRC = os.path.abspath(os.path.join(os.path.dirname(__file__), '../artifacts/Contracts/EduMetaCoinErc20.sol/EduMeta.json'))
DST_DIR = os.path.join(os.path.dirname(__file__), 'artifacts')
DST = os.path.join(DST_DIR, 'EduMeta.json')

os.makedirs(DST_DIR, exist_ok=True)
shutil.copyfile(SRC, DST)
print(f"Copied artifact to {DST}")
