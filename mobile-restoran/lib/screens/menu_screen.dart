import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/menu_model.dart';

class MenuScreen extends StatelessWidget {
  final String token;
  const MenuScreen({super.key, required this.token});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Menu Makanan')),
      body: FutureBuilder<List<MenuModel>>(
        future: ApiService.getMenu(token),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return Center(child: CircularProgressIndicator());
          if (!snapshot.hasData || snapshot.data!.isEmpty) return Center(child: Text('Tidak ada menu tersedia'));

          final menuList = snapshot.data!;

          return Padding(
            padding: const EdgeInsets.all(12.0),
            child: GridView.builder(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.75,
              ),
              itemCount: menuList.length,
              itemBuilder: (context, index) {
                final m = menuList[index];
                return Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Foto Menu
                      ClipRRect(
                        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                        child: Image.network(
                          m.foto,
                          height: 100,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            height: 100,
                            color: Colors.grey[300],
                            child: Icon(Icons.image_not_supported),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              m.nama_menu,
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            SizedBox(height: 4),
                            Text('Rp ${m.harga.toStringAsFixed(0)}'),
                            Text('Stok: ${m.stok}'),
                            SizedBox(height: 8),
                            ElevatedButton(
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('${m.nama_menu} ditambahkan ke pesanan')),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                minimumSize: Size(double.infinity, 26),
                                backgroundColor: Colors.green,
                              ),
                              child: Text('Pesan'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          );
        },
      ),

      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Buka halaman keranjang
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Menuju halaman keranjang...')),
          );
        },
        label: Text('Keranjang'),
        icon: Icon(Icons.shopping_cart),
      ),
    );
  }
}