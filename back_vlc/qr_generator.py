import qrcode

local_id = 2
num_tables = 2  # Número de mesas
for i in range(1, num_tables + 1):
    qr_data = f"local_{local_id}_table_{i}"
    qr = qrcode.make(qr_data)
    qr.save(f"back_vlc/qr_for_tables/local_{local_id}_table_{i}.png")
