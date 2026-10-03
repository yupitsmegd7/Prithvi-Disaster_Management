from pathlib import Path
import zipfile,json
root=Path(__file__).resolve().parents[1]
out=root/'public/downloads/Prithvi_Source.zip'
exclude={'node_modules','.git','.sites-runtime','.wrangler','dist','.vinext','.next','__pycache__','.venv','.agents','.codex'}
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(root.rglob('*')):
  r=p.relative_to(root)
  if not p.is_file() or any(part in exclude for part in r.parts):continue
  if p==out or p.name.endswith('.tsbuildinfo') or p.name.startswith('.dev.vars') or (p.name.startswith('.env') and p.name!='.env.example'):continue
  if r.as_posix()=='.openai/hosting.json':
   z.writestr('Prithvi/.openai/hosting.json',json.dumps({'d1':'DB','r2':None},indent=2));continue
  z.write(p,'Prithvi/'+r.as_posix())
print(str(out),out.stat().st_size)
