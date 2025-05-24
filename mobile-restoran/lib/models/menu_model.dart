class MenuModel {
  final int id_menu;
  final String nama_menu;
  final double harga;
  final int stok;
  final String foto;
  MenuModel(
      {required this.id_menu,
        required this.nama_menu,
        required this.harga,
        required this.foto,
        required this.stok});

  factory MenuModel.fromJson(Map json) {
    return MenuModel(
        id_menu: json['id_menu'],
        nama_menu: json['nama_menu'],
        harga: double.tryParse(json['harga'].toString()) ?? 0.0,
        stok: json['stok'],
        foto: json['foto']);
  }
  Map toJson() => {
    'id_menu': id_menu,
    'nama_menu': nama_menu,
    'harga': harga,
    'stok': stok,
    'foto': foto,
  };
}

// ==== models/meja_model.dart ====
class MejaModel {
  final int? id;
  final int noMeja;
  final int kapasitas;
  final String status;

  MejaModel(
      {this.id,
        required this.noMeja,
        required this.kapasitas,
        required this.status});

  factory MejaModel.fromJson(Map<String, dynamic> json) {
    return MejaModel(
      id: json['id'],
      noMeja: json['no_meja'],
      kapasitas: json['kapasitas'],
      status: json['status'],
    );
  }
}
